import { Component, OnInit, ViewChild } from '@angular/core';
import { ReturnService } from '../../../services/return.service';
import { PdfPenaltyReceiptService } from '../../../services/pdf-penalty-receipt.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EmailService } from '../../../services/email.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar: SnackbarComponent;

  items: any[] = [];
  filteredItems: any[] = [];
  paginatedItems: any[] = [];
  selectedItem: any;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100, 500, 1000];
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  private searchTerms = new Subject<string>();
  isLoading: boolean = false;
  page: number = 1;
  limit: number = 10;
  dateFrom: string | null = null;
  dateTo: string | null = null;
  selectedRemark: string = '';
  isSending: boolean = false;
  showConfirmationModal: boolean = false;

  constructor(
    private returnService: ReturnService,
    private pdfPenaltyReceiptService: PdfPenaltyReceiptService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.fetchBorrowingData();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.filterItems();
    });
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.fetchBorrowingData();
  }

  fetchBorrowingData(): void {
    this.isLoading = true;
    
    this.returnService.getBorrowingData(
      this.dateFrom, 
      this.dateTo, 
      this.selectedRemark, 
      this.searchTerm
    ).subscribe(data => {
      const today = new Date().toISOString().split('T')[0];

      this.items = data.map(item => {
        return {
          ...item,
          name: `${item.first_name} ${item.surname}`,
          courseYear: item.course_department,
          remarks: item.remark,
          dueDate: item.due_date,
          dateBorrowed: item.claim_date,
          returnDate: item.return_date,
          material_id: item.material_id,
          user_id: item.user_id,
          isNotifiedToday: item.last_notified_at === today
        };
      }).sort((a, b) => {
        if (a.remarks !== 'Returned' && a.remarks !== 'Returned Late') {
          if (b.remarks === 'Returned' || b.remarks === 'Returned Late') {
            return -1;
          }
          return new Date(b.dateBorrowed)
            .getTime() - new Date(a.dateBorrowed)
            .getTime();
        }
  
        if (a.remarks === 'Returned' || a.remarks === 'Returned Late') {
          if (b.remarks !== 'Returned' && b.remarks !== 'Returned Late') {
            return 1;
          }
          return new Date(b.returnDate)
            .getTime() - new Date(a.returnDate)
            .getTime();
        }
  
        return 0;
      });
  
      this.filteredItems = this.items;
      this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
      this.paginateItems();
      this.isLoading = false;
    }, error => {
      console.error('Error fetching data', error);
      this.isLoading = false;
    });
  }

  openConfirmationModal(item: any): void {
    this.selectedItem = item;
    this.showConfirmationModal = true;
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.selectedItem = null;
  }

  confirmReturn(): void {
    this.returnService.returnBook(
      this.selectedItem.material_id
    ).subscribe(response => {
      if (response.status === 'success') {
        this.snackbar.showMessage('Book successfully returned.');
        this.fetchBorrowingData();
      } else {
        this.snackbar.showMessage('Error returning book. Please try again.');
      }
      this.closeConfirmationModal();
    });
  }

  onRemarkSelected(remark: string): void {
    this.selectedRemark = remark;
    this.fetchBorrowingData();
  }

  filterItems(): void {
    if (this.searchTerm) {
      this.filteredItems = this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.courseYear.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.material_id.toString().includes(this.searchTerm)
      );
    } else {
      this.filteredItems = this.items;
    }
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginateItems();
  }

  paginateItems(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedItems = this.filteredItems.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateItems();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateItems();
    }
  }

  onSearch(): void {
    this.searchTerms.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedRemark = '';
    this.filterItems();
    this.fetchBorrowingData();
  }

  generatePenaltyReceipt(item: any): void {
    this.selectedItem = item;
    this.returnService.generatePenalty(item.material_id).subscribe(response => {
      if (response.status === 'success') {
        const isStudent = response.user_type === 'student';
        const isEmployee = response.user_type === 'pupt-employee';
        const pdfUrl = this.pdfPenaltyReceiptService
          .generateReceipt(response, isStudent, isEmployee);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          const printWindow = iframe.contentWindow;
          if (printWindow) {
            printWindow.focus();
            printWindow.print();

            const afterPrint = () => {
              const userConfirmed = confirm(
                "Were you able to successfully print or save the receipt?"
              );
              if (userConfirmed) {
                this.confirmPenalty();
              }
              document.body.removeChild(iframe);
            };

            let printTimeout = setTimeout(afterPrint, 1000);

            printWindow.onafterprint = () => {
              clearTimeout(printTimeout);
              afterPrint();
            };
          }
        };
      } else {
        this.snackbar.showMessage(
          'Error generating penalty receipt. Please try again.'
        );
      }
    });
  }

  confirmPenalty(): void {
    this.returnService.updateRemark(
      this.selectedItem.material_id, 'Processing'
    ).subscribe(response => {
      if (response.status === 'success') {
        this.fetchBorrowingData();
      } else {
        this.snackbar.showMessage('Error confirming penalty. Please try again.');
      }
    });
  }

  sendNotification(item: any): void {
    if (!item.isNotifiedToday) {
      this.isSending = true;
      this.emailService.sendPenaltyNotification(
        item.user_id, item.material_id
      ).subscribe({
        next: (response) => {
          this.isSending = false;
          if (response.status === 'success') {
            this.snackbar.showMessage('Notification sent successfully.');
            item.isNotifiedToday = true;
          } else {
            this.snackbar.showMessage('Failed to send notification.');
          }
        },
        error: (err) => {
          this.isSending = false;
          this.snackbar.showMessage(
            'Error sending notification. Please try again.'
          );
        }
      });
    }
  }
}
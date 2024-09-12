import { Component, OnInit } from '@angular/core';
import { ReturnService } from '../../../services/return.service';
import { PdfPenaltyReceiptService } from '../../../services/pdf-penalty-receipt.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {
  items: any[] = [];
  paginatedItems: any[] = [];
  selectedItem: any;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  private searchTerms = new Subject<string>();
  isLoading: boolean = false;
  page: number = 1;
  limit: number = 10; // Adjust as needed
  dateFrom: string | null = null; // Optional date range
  dateTo: string | null = null; // Optional date range

  constructor(
    private returnService: ReturnService,
    private pdfPenaltyReceiptService: PdfPenaltyReceiptService
  ) {}

  ngOnInit(): void {
    this.fetchBorrowingData();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.returnService.searchBorrowingData(term, this.page, this.limit, this.dateFrom, this.dateTo))
    ).subscribe(data => {
      this.items = data.map(item => {
        return {
          ...item,
          name: `${item.first_name} ${item.surname}`,
          courseYear: item.course_department,
          remarks: item.remark,
          dueDate: item.due_date,
          dateBorrowed: item.claim_date,
          material_id: item.material_id
        };
      }).sort((a, b) => {
        if (a.remarks === 'Returned Late' || a.remarks === 'Returned') {
          return 1;
        } else if (a.remarks !== 'Returned' && b.remarks === 'Returned') {
          return -1;
        } else {
          return new Date(b.dateBorrowed).getTime() - new Date(a.dateBorrowed).getTime();
        }
      });
    });
  }

  fetchBorrowingData(): void {
    this.returnService.getBorrowingData(this.dateFrom, this.dateTo).subscribe(data => {
      this.items = data.map(item => {
        return {
          ...item,
          name: `${item.first_name} ${item.surname}`,
          courseYear: item.course_department,
          remarks: item.remark,
          dueDate: item.due_date,
          dateBorrowed: item.claim_date,
          returnDate: item.return_date,
          material_id: item.material_id
        };
      }).sort((a, b) => {
        if (a.remarks !== 'Returned' && a.remarks !== 'Returned Late') {
          if (b.remarks === 'Returned' || b.remarks === 'Returned Late') {
            return -1;
          }
          return new Date(b.dateBorrowed).getTime() - new Date(a.dateBorrowed).getTime();
        }
  
        if (a.remarks === 'Returned' || a.remarks === 'Returned Late') {
          if (b.remarks !== 'Returned' && b.remarks !== 'Returned Late') {
            return 1;
          }
          return new Date(b.returnDate).getTime() - new Date(a.returnDate).getTime();
        }
  
        return 0;
      });
  
      this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
      this.paginateItems();
    });
  }  

  paginateItems(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedItems = this.items.slice(start, end);
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
    this.fetchBorrowingData(); // Reload original data without search
  }

  generatePenaltyReceipt(item: any): void {
    this.selectedItem = item;
    this.returnService.generatePenalty(item.material_id).subscribe(response => {
      if (response.status === 'success') {
        const isStudent = response.user_type === 'student';
        const pdfUrl = this.pdfPenaltyReceiptService.generateReceipt(response, isStudent);

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
              const userConfirmed = confirm("Were you able to successfully print or save the receipt?");
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
        alert('Error generating penalty receipt: ' + response.message);
      }
    });
  }

  confirmPenalty(): void {
    this.returnService.updateRemark(this.selectedItem.material_id, 'Processing').subscribe(response => {
      if (response.status === 'success') {
        this.fetchBorrowingData();
      } else {
        alert('Error confirming penalty: ' + response.message);
      }
    });
  }
}

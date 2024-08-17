import { Component, OnInit } from '@angular/core';
import { ReturnService } from '../../../services/return.service';
import { PdfPenaltyReceiptService } from '../../../services/pdf-penalty-receipt.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {
  items: any[] = [];
  selectedItem: any;

  constructor(
    private returnService: ReturnService,
    private pdfPenaltyReceiptService: PdfPenaltyReceiptService
  ) {}

  ngOnInit(): void {
    this.fetchBorrowingData();
  }

  fetchBorrowingData(): void {
    this.returnService.getBorrowingData().subscribe(data => {
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
          return 1; // push returned items to the bottom
        } else if (a.remarks !== 'Returned' && b.remarks === 'Returned') {
          return -1;
        } else {
          return new Date(b.dateBorrowed).getTime() - new Date(a.dateBorrowed).getTime();
        }
      });
    });
  }

  generatePenaltyReceipt(item: any): void {
    this.selectedItem = item;
    this.returnService.generatePenalty(item.material_id).subscribe(response => {
      if (response.status === 'success') {
        const pdfUrl = this.pdfPenaltyReceiptService.generateReceipt(response);

        // Create an iframe to load the PDF
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          const printWindow = iframe.contentWindow;
          if (printWindow) {
            printWindow.focus();
            printWindow.print();

            // Set a timeout to wait for the print dialog to close
            setTimeout(() => {
              const userConfirmed = confirm("Did the PDF get printed or saved successfully?");
              if (userConfirmed) {
                this.confirmPenalty(); // Update remark to 'Processing'
              }
              document.body.removeChild(iframe); // Clean up
            }, 500);
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


//GOOD
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReturnService } from './return.service';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable()
export class PdfReportBorrowersService {
  constructor(private returnService: ReturnService, 
              private currentDateYearService: CurrentDateYearService) {}

  generatePDF(iframeId: string, dateFrom: string | null, dateTo: string | null,
    setLoading: (loading: boolean) => void, setShowInitialDisplay: (show: boolean) => void) {
    setLoading(true);
    setShowInitialDisplay(false);

    const doc = new jsPDF('landscape');
    const title = "Polytechnic University of the Philippines - Taguig Campus";
    const subtitle = "PUPT BORROWERS REPORT";
    const dateAndTime = `YEAR AS OF ${this.currentDateYearService
          .getCurrentYearAndDate('no_date')}`;

    this.returnService.getBorrowingData(dateFrom, dateTo).subscribe(
      response => {
        const borrowersData = response || [];
        const tableData = borrowersData.map((borrower: any) => [
          borrower.title,
          borrower.author,
          borrower.user_type,
          `${borrower.first_name} ${borrower.surname}`,
          borrower.course_department,
          borrower.claim_date,
          borrower.due_date,
          borrower.remark
        ]);

        doc.setFontSize(16);
        doc.setTextColor("#800000");
        doc.text(title, doc.internal.pageSize
            .getWidth() / 2, 15, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor("#000000");
        doc.text(subtitle, doc.internal.pageSize
            .getWidth() / 2, 23, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor("#252525");
        doc.text(dateAndTime, doc.internal.pageSize
            .getWidth() / 2, 30, { align: "center" });

        let startY = 35;
        autoTable(doc, {
          head: [[ 'Title', 'Author', 'User Type', 'Name', 'Course', 'Claim Date', 'Due Date', 'Remark']],
          body: tableData,
          startY: startY,
          theme: 'grid',
          headStyles: { fillColor: '#800000', textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 40 },
            2: { cellWidth: 20 },
            3: { cellWidth: 45 },
            4: { cellWidth: 20 },
            5: { cellWidth: 30 },
            6: { cellWidth: 30 },
            7: { cellWidth: 30 },
          },
          styles: {
            overflow: 'linebreak',
            cellPadding: 2
          },
          didDrawPage: (data) => {
            startY = data.cursor.y;
          }
        });

        const labelXPosition = 20;
        const valueXPosition = 80;

        doc.setFontSize(10);
        // Date generated
        doc.text(`Report Generated On:`, labelXPosition, 
            doc.internal.pageSize.getHeight() - 20);
        doc.text(`${this.currentDateYearService
              .getCurrentYearAndDate('get_date')}`, valueXPosition, 
            doc.internal.pageSize.getHeight() - 20);

        // Total records
        doc.text(`Total Borrowers Records:`, labelXPosition, 
            doc.internal.pageSize.getHeight() - 15);
        doc.text(`${borrowersData.length}`, valueXPosition, 
            doc.internal.pageSize.getHeight() - 15);

        // Filter
        if (dateFrom && dateTo) {
          doc.text(`Borrowing Data From:`, labelXPosition, 
              doc.internal.pageSize.getHeight() - 10);
          doc.text(`${this.currentDateYearService
              .formatDateString(dateFrom)} - ${this.currentDateYearService
              .formatDateString(dateTo)}`, valueXPosition, 
              doc.internal.pageSize.getHeight() - 10);
        }

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
        iframe.src = pdfUrl;

        setLoading(false);
      },
      error => {
        console.error('Error generating PDF:', error);
        setLoading(false);
      }
    );
  }
}

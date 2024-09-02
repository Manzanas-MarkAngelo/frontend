import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfPenaltyReceiptService {
  constructor() {}

  generateReceipt(response: any, isStudent: boolean): string {
    const doc = new jsPDF('landscape');
    const img = new Image();
    img.src = 'assets/pup.png';

    const borrowerDetails = {
      name: `${response.first_name} ${response.surname}`,
      borrowerId: response.borrower_id,
      date: this.getCurrentDate(),
      title: response.title,
      author: response.author,
      dateBorrowed: this.formatDate(response.date_borrowed),
      dueDate: this.formatDate(response.due_date),
      returnDate: this.getCurrentDate(),
      amountDue: `P${response.amount_due}`
    };

    const copyLabelLeft = isStudent ? "STUDENT'S COPY" : "FACULTY'S COPY";
    const idLabel = isStudent ? "Student Number:" : "Faculty Code:";
    const copyLabelRight = "LIBRARY'S COPY";

    doc.setFont('helvetica');
    doc.setFontSize(12);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 3;
    const leftX = margin;
    const sectionWidth = (pageWidth / 2) - (margin * 2);
    const rightX = pageWidth / 2 + margin;

    const topY = margin;
    const bottomY = pageHeight - margin;

    doc.setLineWidth(.6);

    function drawText(isBold: boolean, text: string, x: number, y: number, options?: any) {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.text(text, x, y, options);
    }

    function drawSection(x, headerText, idLabel) {
      doc.rect(x, topY, sectionWidth, bottomY - topY);

      drawText(true, headerText, x + sectionWidth - margin, topY + 10, { align: 'right' });

      doc.addImage(img, 'PNG', x + margin, topY + 18, 20, 20);
      drawText(true, 'POLYTECHNIC UNIVERSITY OF THE PHILIPPINES', x + 78, topY + 25, { align: 'center' });
      drawText(true, 'Taguig Branch', x + 78, topY + 30, { align: 'center' });
      drawText(true, 'Library Management System', x + 78, topY + 35, { align: 'center' });

      drawText(true, 'Invoice Number:', x + sectionWidth - 65, topY + 55);
      drawText(false, '__________', x + sectionWidth - 30, topY + 55);
      drawText(true, 'Name:', x + margin, topY + 70);
      drawText(false, borrowerDetails.name, x + margin + 16, topY + 70);
      drawText(true, idLabel, x + margin, topY + 80);
      drawText(false, borrowerDetails.borrowerId, x + margin + 38, topY + 80);
      drawText(true, 'Date:', x + sectionWidth - 42, topY + 70);
      drawText(false, borrowerDetails.date, x + sectionWidth - 28, topY + 70);

      autoTable(doc, {
        startY: topY + 90,
        head: [['Book Title', 'Author', 'Date Borrowed', 'Due Date', 'Date Returned', 'Amount Due']],
        body: [
          [
            borrowerDetails.title,
            borrowerDetails.author,
            borrowerDetails.dateBorrowed,
            borrowerDetails.dueDate,
            borrowerDetails.returnDate,
            borrowerDetails.amountDue
          ]
        ],
        styles: {
          fontSize: 11,
          cellPadding: 1,
          minCellHeight: 6,
          halign: 'center'
        },
        headStyles: {
          fontStyle: 'bold',
          fillColor: [128, 30, 29],
          textColor: [255, 255, 255],
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
          5: { halign: 'center' }
        },
        theme: 'grid',
        margin: { left: x + margin, right: margin },
        tableWidth: sectionWidth - (margin * 2)
      });

      const tableY = (doc as any).lastAutoTable.finalY;

      drawText(true, 'Note:', x + margin, tableY + 15);
      drawText(false, 'We will charge P10.00 (ten pesos) a day for the late return of book/s.', x + margin + 6, tableY + 20);
      drawText(false, 'Please pay the amount due to the Cashier’s Office. Thank you!', x + margin + 6, tableY + 25);
      drawText(true, 'Signed By:', x + sectionWidth / 2, tableY + 40, { align: 'center' });
      drawText(false, '_______________________________', x + sectionWidth / 2, tableY + 50, { align: 'center' });
      drawText(true, response.librarian_name, x + sectionWidth / 2, tableY + 60, { align: 'center' });
      drawText(false, 'Registered Librarian', x + sectionWidth / 2, tableY + 65, { align: 'center' });
    }

    drawSection(leftX, copyLabelLeft, idLabel);
    drawSection(rightX, copyLabelRight, idLabel);

    const pageMiddleX = pageWidth / 2;
    const dashLength = 2;
    const gapLength = 2;

    for (let y = 0; y < pageHeight; y += dashLength + gapLength) {
      doc.line(pageMiddleX, y, pageMiddleX, y + dashLength);
    }

    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  }

  getCurrentDate(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return `${String(d.getFullYear()).padStart(4, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
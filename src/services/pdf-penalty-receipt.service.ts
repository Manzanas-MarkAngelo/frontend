import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfPenaltyReceiptService {
  constructor() {}

  generateReceipt(response: any): string {
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
      returnDate: this.getCurrentDate(), // Use the actual return date
      amountDue: `₱${response.amount_due}`
    };

    // Set up common styles
    doc.setFont('helvetica');
    doc.setFontSize(10); // Adjusted font size for better fit

    // Borders and spacing
    const marginBetweenCopies = 5;
    const sectionWidth = 135; // Half of the page width minus margin
    const sectionHeight = 130; // Adjust based on the content height

    // Draw full border for Student's Copy
    doc.rect(5, 5, sectionWidth, sectionHeight);

    // Header for Student's Copy (Left side)
    doc.addImage(img, 'PNG', 10, 10, 15, 15);
    doc.text('POLYTECHNIC UNIVERSITY OF THE PHILIPPINES', 30, 15);
    doc.text('Taguig Branch', 30, 20);
    doc.text('Library Management System', 30, 25);

    doc.text('Invoice Number:', 30, 35);
    doc.text('Date:', 105, 35);
    doc.text(borrowerDetails.date, 130, 35);

    doc.text('Name:', 30, 40);
    doc.text(borrowerDetails.name, 65, 40);
    doc.text('ID Number:', 105, 40);
    doc.text(borrowerDetails.borrowerId, 130, 40);

    // Add autoTable with column width adjustments for Student's Copy
    autoTable(doc, {
      startY: 50,
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
        fontSize: 8, // Smaller font size for table content
        cellPadding: 1,
        minCellHeight: 6,
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Title
        1: { cellWidth: 20 }, // Author
        2: { cellWidth: 20 }, // Date Borrowed
        3: { cellWidth: 20 }, // Due Date
        4: { cellWidth: 20 }, // Date Returned
        5: { cellWidth: 20 }, // Amount Due
      },
      theme: 'grid',
      margin: { left: 10, right: 0, bottom: 0 },
      tableWidth: sectionWidth - 10
    });

    const studentTableY = (doc as any).lastAutoTable.finalY;

    doc.text('Total Amount: ', 100, studentTableY + 10);
    doc.text(borrowerDetails.amountDue, 130, studentTableY + 10);

    doc.text('Note: We will charge ₱10.00 (ten pesos) a day for the late return of book/s.', 10, studentTableY + 20);
    doc.text('Please pay the amount due to the Cashier’s Office. Thank you!', 10, studentTableY + 25);
    doc.text('Signed by:', 10, studentTableY + 35);
    doc.text('Elena C. Mamansag', 10, studentTableY + 40);
    doc.text('Registered Librarian', 10, studentTableY + 45);

    // Draw full border for Library's Copy
    doc.rect(sectionWidth + marginBetweenCopies + 10, 5, sectionWidth, sectionHeight);

    // Header for Library's Copy (Right side)
    doc.addImage(img, 'PNG', 150 + marginBetweenCopies, 10, 15, 15);
    doc.text('POLYTECHNIC UNIVERSITY OF THE PHILIPPINES', 170 + marginBetweenCopies, 15);
    doc.text('Taguig Branch', 170 + marginBetweenCopies, 20);
    doc.text('Library Management System', 170 + marginBetweenCopies, 25);

    doc.text('Invoice Number:', 170 + marginBetweenCopies, 35);
    doc.text('Date:', 245 + marginBetweenCopies, 35);
    doc.text(borrowerDetails.date, 270 + marginBetweenCopies, 35);

    doc.text('Name:', 170 + marginBetweenCopies, 40);
    doc.text(borrowerDetails.name, 205 + marginBetweenCopies, 40);
    doc.text('ID Number:', 245 + marginBetweenCopies, 40);
    doc.text(borrowerDetails.borrowerId, 270 + marginBetweenCopies, 40);

    // Add autoTable for Library's Copy
    autoTable(doc, {
      startY: 50,
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
        fontSize: 8, // Smaller font size for table content
        cellPadding: 1,
        minCellHeight: 6,
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Title
        1: { cellWidth: 20 }, // Author
        2: { cellWidth: 20 }, // Date Borrowed
        3: { cellWidth: 20 }, // Due Date
        4: { cellWidth: 20 }, // Date Returned
        5: { cellWidth: 20 }, // Amount Due
      },
      theme: 'grid',
      margin: { left: 150 + marginBetweenCopies, right: 10, bottom: 0 },
      tableWidth: sectionWidth - 10
    });

    const libraryTableY = (doc as any).lastAutoTable.finalY;

    doc.text('Total Amount: ', 220 + marginBetweenCopies, libraryTableY + 10);
    doc.text(borrowerDetails.amountDue, 250 + marginBetweenCopies, libraryTableY + 10);

    doc.text('Note: We will charge ₱10.00 (ten pesos) a day for the late return of book/s.', 150 + marginBetweenCopies, libraryTableY + 20);
    doc.text('Please pay the amount due to the Cashier’s Office. Thank you!', 150 + marginBetweenCopies, libraryTableY + 25);
    doc.text('Signed by:', 150 + marginBetweenCopies, libraryTableY + 35);
    doc.text('Elena C. Mamansag', 150 + marginBetweenCopies, libraryTableY + 40);
    doc.text('Registered Librarian', 150 + marginBetweenCopies, libraryTableY + 45);

    // Return the generated PDF blob
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

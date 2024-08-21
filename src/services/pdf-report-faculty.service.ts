import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RecordsService } from './records.service';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable()
export class PdfReportFacultyService {
  constructor(private recordsService: RecordsService, 
              private currentDateYearService: CurrentDateYearService) {}

  generatePDF(iframeId: string, dateFrom: string | null, dateTo: string | null,
    setLoading: (loading: boolean) => void, setShowInitialDisplay: (show: boolean) => void) {
    setLoading(true);
    setShowInitialDisplay(false);
    
    console.log('PDF SERVICE' + dateFrom);

    const doc = new jsPDF('landscape');
    const title = "Polytechnic University of the Philippines - Taguig Campus";
    const subtitle = "PUPT FACULTY TIME LOGS";
    const dateAndTime = `YEAR AS OF ${this.currentDateYearService.getCurrentYearAndDate('no_date')}`;

    // Image settings
    const imgBase64 = '../assets/pup.png'; // Replace with your base64 image string or URL
    const imgXPosition = 15; // X position for the image
    const imgYPosition = 5; // Y position for the image
    const imgWidth = 23; // Image width
    const imgHeight = 23; // Image height

    // Add the image to the PDF at the top left corner
    doc.addImage(imgBase64, 'PNG', imgXPosition, imgYPosition, imgWidth, imgHeight);

    // Adjust text positioning to start below the image
    const textStartY = 12; // Position the text below the image with a margin

    doc.setFontSize(18);
    doc.setTextColor("#800000");
    doc.text(title, doc.internal.pageSize
          .getWidth() / 2, textStartY, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(subtitle, doc.internal.pageSize
          .getWidth() / 2, textStartY + 8, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor("#252525");
    doc.text(dateAndTime, doc.internal.pageSize
          .getWidth() / 2, textStartY + 15, { align: "center" });

    let startY = textStartY + 23; // Adjust the table start Y position accordingly

    this.recordsService.getLogs('faculty', 10, 1, dateFrom, dateTo).subscribe(
      response => {
        const facultyData = response?.records || [];
        const tableData = facultyData.map((faculty: any) => [
          faculty.faculty_code,
          faculty.name,
          faculty.department,
          faculty.time_in,
          faculty.time_out ? faculty.time_out : 'await'
        ]);

        autoTable(doc, {
          head: [['Faculty Code', 'Name', 'Department', 'Time In', 'Time Out']],
          body: tableData,
          startY: startY,
          theme: 'grid',
          headStyles: { fillColor: '#800000', textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 70 },
            2: { cellWidth: 40 },
            3: { cellWidth: 60 },
            4: { cellWidth: 60 }
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
        doc.text(`${this.currentDateYearService.getCurrentYearAndDate('get_date')}`, 
            valueXPosition, doc.internal.pageSize.getHeight() - 20);

        // Total records
        doc.text(`Total Faculty Records:`, labelXPosition, 
            doc.internal.pageSize.getHeight() - 15);
        doc.text(`${facultyData.length}`, valueXPosition, 
            doc.internal.pageSize.getHeight() - 15);

        // Filter
        if (dateFrom && dateTo) {
          doc.text(`Time Log Ranging From:`, labelXPosition, 
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

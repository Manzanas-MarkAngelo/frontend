import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportsService } from './reports.service';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable()
export class PdfReportInventoryService {
  constructor(
    private reportsService: ReportsService, 
    private currentDateYearService: CurrentDateYearService
  ) {}

  generatePDF(
    selectedCategory: string, 
    iframeId: string, 
    setLoading: (loading: boolean) => void, 
    setShowInitialDisplay: (show: boolean) => void, 
    categoryDisplay: string,
    program: string // Program parameter added
  ) {
    // Preserve existing logic for loading state
    setLoading(true);
    setShowInitialDisplay(false);

    // Preserve and adjust logic for category display
    let category = categoryDisplay !== 'All' ? categoryDisplay.toUpperCase() : '';
    categoryDisplay = categoryDisplay === '' ? 'All' : categoryDisplay;

    // New logic for program display
    const programDisplay = program === '' ? 'All' : program; // Display 'All' if no program is selected

    const doc = new jsPDF('landscape');
    const title = "Polytechnic University of the Philippines - Taguig Campus";
    const subtitle = `PUPT INVENTORY REPORTS ${category}`;
    const dateAndTime = `YEAR AS OF ${this.currentDateYearService.getCurrentYearAndDate('no_date')}`;

    // Logo settings (existing logic)
    const imgBase64 = '../assets/pup.png';
    const imgXPosition = 15;
    const imgYPosition = 5;
    const imgWidth = 23;
    const imgHeight = 23;

    doc.addImage(imgBase64, 'PNG', imgXPosition, imgYPosition, imgWidth, imgHeight);

    const textStartY = 12; // Existing logic for text positioning
    doc.setFontSize(18);
    doc.setTextColor("#800000");
    doc.text(title, doc.internal.pageSize.getWidth() / 2, textStartY, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(subtitle, doc.internal.pageSize.getWidth() / 2, textStartY + 8, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor("#252525");
    doc.text(dateAndTime, doc.internal.pageSize.getWidth() / 2, textStartY + 15, { align: "center" });

    let startY = textStartY + 23;

    // Preserve the service call and existing logic
    this.reportsService.getMaterials(selectedCategory, program).subscribe(
      data => {
        // Preserve existing logic for mapping table data
        const tableData = data.data.map((material: any) => [
          material.accnum,
          material.author,
          material.title,
          material.copyright,
          material.callno,
          material.isbn,
          material.status
        ]);

        const totalItems = tableData.length;

        // Existing table generation logic
        autoTable(doc, {
          head: [['Accession No.', 'Author', 'Title', 'Copyright', 
                  'Call No.', 'ISBN', 'Remarks']],
          body: tableData,
          startY: startY,
          theme: 'grid',
          headStyles: { fillColor: '#800000', textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 70 },
            3: { cellWidth: 25 },
            4: { cellWidth: 50 },
            5: { cellWidth: 30 },
            6: { cellWidth: 20 }
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

        // Display Category (existing logic)
        doc.setFontSize(10);
        doc.text(`CATEGORY:`, labelXPosition, doc.internal.pageSize.getHeight() - 30);
        doc.text(categoryDisplay, valueXPosition, doc.internal.pageSize.getHeight() - 30);

        // Display Program (new logic for program display)
        doc.text(`PROGRAM:`, labelXPosition, doc.internal.pageSize.getHeight() - 25); // Added program display
        doc.text(programDisplay, valueXPosition, doc.internal.pageSize.getHeight() - 25);

        // Display total items count (existing logic)
        doc.text(`MATERIALS COUNT:`, labelXPosition, doc.internal.pageSize.getHeight() - 20);
        doc.text(`${totalItems}`, valueXPosition, doc.internal.pageSize.getHeight() - 20);

        // Display report generation date (existing logic)
        doc.text(`REPORT GENERATED ON:`, labelXPosition, doc.internal.pageSize.getHeight() - 15);
        doc.text(`${this.currentDateYearService.getCurrentYearAndDate('get_date')}`, valueXPosition, doc.internal.pageSize.getHeight() - 15);

        // Generate PDF output (existing logic)
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
        iframe.src = pdfUrl;

        setLoading(false);
      },
      error => {
        // Error handling (existing logic)
        console.error('Error generating PDF:', error);
        setLoading(false);
      }
    );
  }

  // Preserve existing logic for category filter label
  private getCategoryFilterLabel(selectedCategory: string): string {
    return selectedCategory ? selectedCategory : 'None';
  }
}

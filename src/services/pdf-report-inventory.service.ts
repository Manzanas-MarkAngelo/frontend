import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportsService } from './reports.service';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable()
export class PdfReportInventoryService {
  constructor(private reportsService: ReportsService, 
              private currentDateYearService: CurrentDateYearService ) {}

  generatePDF(selectedCategory: string, iframeId: string, setLoading: 
    (loading: boolean) => void, setShowInitialDisplay: 
    (show: boolean) => void) {
      
    setLoading(true);
    setShowInitialDisplay(false);

    const doc = new jsPDF('landscape');
    const title = "Polytechnic University of the Philippines - Taguig Campus";
    const subtitle = "PUPT INVENTORY REPORTS";
    const dateAndTime = `YEAR AS OF ${this.currentDateYearService
          .getCurrentYearAndDate('no_date')}`;

    this.reportsService.getMaterials(selectedCategory).subscribe(
      data => {
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
        //Filter
        doc.setFontSize(10);
        doc.text(`FILTER:`, labelXPosition, doc.internal.pageSize
            .getHeight() - 25);
        doc.text(this.getCategoryFilterLabel(selectedCategory), valueXPosition, 
            doc.internal.pageSize.getHeight() - 25);

        //Total Items
        doc.text(`MATERIALS COUNT:`, labelXPosition, doc.internal.pageSize
            .getHeight() - 20);
        doc.text(`${totalItems}`, valueXPosition, doc.internal.pageSize
            .getHeight() - 20);

        //Date and Year
        doc.text(`REPORT GENERATED ON:`, labelXPosition, doc.internal.pageSize
            .getHeight() - 15);
        doc.text(`${this.currentDateYearService
              .getCurrentYearAndDate('get_date')}`, valueXPosition, 
          doc.internal.pageSize.getHeight() - 15);

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

  private getCategoryFilterLabel(selectedCategory: string): string {
    return selectedCategory ? selectedCategory : 'None';
  }
}

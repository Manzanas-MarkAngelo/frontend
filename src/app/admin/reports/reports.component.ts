import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportsService } from '../../../services/reports.service'; 

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  inventoryPlaceholder: string = 'Inventory';
  categoryPlaceholder: string = 'Category';
  programPlaceholder: string = 'Program';
  isLoading: boolean = false; // Add a loading state

  constructor(private reportsService: ReportsService) { }

  InventoryPlaceholder(value: string) {
    this.inventoryPlaceholder = value;
  }

  CategoryPlaceholder(value: string) {
    this.categoryPlaceholder = value;
  }

  ProgramPlaceholder(value: string) {
    this.programPlaceholder = value;
  }

  generatePDFPreview() {
    this.isLoading = true; // Set loading state to true

    const doc = new jsPDF('landscape');
    const title = "Polytechnic University of the Philippines - Taguig Campus";
    const subtitle = "PUPT INVENTORY REPORTS";

    this.reportsService.getMaterials().subscribe(
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

        doc.setFontSize(16);
        doc.setTextColor("#800000");
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor("#000000");
        doc.text(subtitle, doc.internal.pageSize.getWidth() / 2, 23, { align: "center" });

        let startY = 30;

        autoTable(doc, {
          head: [['Accession No.', 'Author', 'Title', 'Copyright', 'Call No.', 'ISBN', 'Remarks']],
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

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = document.getElementById('pdf-preview') as HTMLIFrameElement;
        iframe.src = pdfUrl;

        this.isLoading = false; // Set loading state to false after PDF is generated
      },
      error => {
        console.error('Error generating PDF:', error);
        this.isLoading = false; // Set loading state to false in case of error
      }
    );
  }
}

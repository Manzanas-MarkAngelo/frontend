import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportsService } from '../../../services/reports.service'; 
import { MaterialsService } from '../../../services/materials.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  inventoryPlaceholder: string = 'Inventory';
  categoryPlaceholder: string = 'Category';
  programPlaceholder: string = 'Program';
  category: string = ''; // This will hold the selected accession number
  isLoading: boolean = false;
  categories: { mat_type: string, accession_no: string }[] = [];
  showInitialDisplay: boolean = true;
  yearAndDate = '';
  totalItems: number = 0;  // Define totalItems property

  constructor(private reportsService: ReportsService, 
              private materialService: MaterialsService) { }

  ngOnInit() {
    this.fetchCategories();  
  }

  fetchCategories() {
    this.materialService.getCategories().subscribe(
      data => {
        this.categories = data.map((category: any) => ({
          mat_type: category.mat_type,
          accession_no: category.accession_no
        }));
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  
  InventoryPlaceholder(value: string) {
    this.inventoryPlaceholder = value;
  }

  CategoryPlaceholder(value: string) {
    console.log('Selected category:', value);
    this.categoryPlaceholder = value;
    this.category = this.mapCategoryToAccessionNumber(value);
    console.log(`Mapped accession number: ${this.category}`);
  }

  mapCategoryToAccessionNumber(selectedType: string): string {
    if (selectedType === 'All') {
      return ''; // Handle 'All' case for all records
    }
    const matchedCategory = this.categories.find(cat => cat.mat_type === selectedType);
    return matchedCategory ? matchedCategory.accession_no : '';
  }

  ProgramPlaceholder(value: string) {
    this.programPlaceholder = value;
  }

  
  getCurrentYearAndDate(option: 'get_date' | 'no_date'): string {
      const now = new Date();
      const year = now.getFullYear();
      
      return option === 'get_date' 
          ? `${now.toLocaleString('en-US', { month: 'short' })} ${now.getDate()}, ${year}`
          : `${year}`;
    
  }

  //* PDF Generation
  generatePDFPreview() {
    this.isLoading = true;
    this.showInitialDisplay = false;
  
    const doc = new jsPDF('landscape');
    const title = "Polytechnic University of the Philippines - Taguig Campus";
    const subtitle = "PUPT INVENTORY REPORTS";
    const dateAndTime = `YEAR AS OF ${this.getCurrentYearAndDate('no_date')}`;
  
    const selectedCategory = this.categoryPlaceholder === 'Category' ? '' : this.category;
  
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
        this.totalItems = tableData.length;
  
        doc.setFontSize(16);
        doc.setTextColor("#800000");
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
  
        doc.setFontSize(12);
        doc.setTextColor("#000000");
        doc.text(subtitle, doc.internal.pageSize.getWidth() / 2, 23, { align: "center" });
  
        doc.setFontSize(12);
        doc.setTextColor("#252525");
        doc.text(dateAndTime, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });
  
        let startY = 35; //starting Y value for the table
  
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
        //TODO implement page number const totalPages = doc.getNumberOfPages();

        // Define positions
        const labelXPosition = 20; // X position for the labels
        const valueXPosition = 80; // X position for the values

        // Filter
        const filterValue = (this.categoryPlaceholder === 'Category' || 
            this.categoryPlaceholder === 'All') ? 
            'None' : this.categoryPlaceholder;
        doc.setFontSize(12);
        doc.text(`FILTER:`, labelXPosition, doc.internal.pageSize
            .getHeight() - 25);
        doc.text(`${filterValue}`, valueXPosition, doc.internal.pageSize
            .getHeight() - 25);

        // Total Items
        doc.text(`MATERIALS COUNT:`, labelXPosition, doc.internal.pageSize
            .getHeight() - 20);
        doc.text(`${this.totalItems}`, valueXPosition, doc.internal.pageSize
            .getHeight() - 20);

        // Year and Date
        doc.text(`REPORT GENERATED ON:`, labelXPosition, doc.internal.pageSize
            .getHeight() - 15);
        doc.text(`${this.getCurrentYearAndDate('get_date')}`, valueXPosition, 
            doc.internal.pageSize.getHeight() - 15);

  
  
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const iframe = document.getElementById('pdf-preview') as HTMLIFrameElement;
        iframe.src = pdfUrl;
  
        this.isLoading = false;
      },
      error => {
        console.error('Error generating PDF:', error);
        this.isLoading = false;
      }
    );
  }

    //* Excel/CSV Generation
    async saveAsExcel() {
      this.isLoading = true;
  
      const selectedCategory = this.categoryPlaceholder === 'Category' ? '' : this.category;
  
      this.reportsService.getMaterials(selectedCategory).subscribe(
        async data => {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Report');
  
          // Add header row
          worksheet.addRow(['Accession No.', 'Author', 'Title', 'Copyright', 
                            'Call No.', 'ISBN', 'Remarks']);
          
          // Add data rows
          data.data.forEach((material: any) => {
            worksheet.addRow([
              material.accnum,
              material.author,
              material.title,
              material.copyright,
              material.callno,
              material.isbn,
              material.status
            ]);
          });
  
          // Set column widths
          worksheet.columns = [
            { width: 15 }, // Accession No.
            { width: 70 }, // Author
            { width: 70 }, // Title
            { width: 15 }, // Copyright
            { width: 40 }, // Call No.
            { width: 35 }, // ISBN
            { width: 20 }  // Remarks
          ];
  
          // Style the header
          worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF800000' }
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } }
            };
          });
  
          // Style data rows
          worksheet.eachRow({ includeEmpty: false }, row => {
            row.eachCell(cell => {
              cell.alignment = { vertical: 'middle', horizontal: 'left' };
              cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
              };
            });
          });
  
          // Generate Excel file
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: 'application/octet-stream' });
          saveAs(blob, `PUPT_Inventory_Report_${new Date().getTime()}.xlsx`);
  
          this.isLoading = false;
        },
        error => {
          console.error('Error generating Excel:', error);
          this.isLoading = false;
        }
      );
    }
  }

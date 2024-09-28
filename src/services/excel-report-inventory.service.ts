import { Injectable } from '@angular/core';
import { ReportsService } from './reports.service'; 
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable()
export class ExcelReportInventoryService {

  constructor(private reportsService: ReportsService, 
              private currentDateYearService: CurrentDateYearService) { }

  async generateExcelReport(category: string, program: string, callback: (loading: boolean) => void, categoryDisplay: string) {
    callback(true);

    let selectedCategory = '';
    let selectedProgram = program;  // Add program variable

    selectedCategory = categoryDisplay !== 'All' ? categoryDisplay.toUpperCase() : selectedCategory;
    categoryDisplay = categoryDisplay === '' ? 'All' : categoryDisplay;

    this.reportsService.getMaterials(category, program).subscribe(
      async data => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory Report');

        // Title
        const title = "Polytechnic University of the Philippines - Taguig Campus";
        const subtitle = `PUPT INVENTORY REPORTS ${selectedCategory}`;
        const dateAndTime = `YEAR AS OF ${new Date().getFullYear()}`;
        
        // Add title and merge cells
        worksheet.mergeCells('A1:G1');
        worksheet.getCell('A1').value = title;
        worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF800000' } };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        
        // Add subtitle and merge cells
        worksheet.mergeCells('A2:G2');
        worksheet.getCell('A2').value = subtitle;
        worksheet.getCell('A2').font = { bold: true, size: 12, color: { argb: 'FF000000' } };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };
        
        // Add date and merge cells
        worksheet.mergeCells('A3:G3');
        worksheet.getCell('A3').value = dateAndTime;
        worksheet.getCell('A3').font = { bold: false, size: 12, color: { argb: 'FF252525' } };
        worksheet.getCell('A3').alignment = { horizontal: 'center' };

        // Add some spacing before the table
        worksheet.addRow([]);

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
          { width: 25 }, // Accession No.
          { width: 70 }, // Author
          { width: 70 }, // Title
          { width: 15 }, // Copyright
          { width: 40 }, // Call No.
          { width: 35 }, // ISBN
          { width: 20 }  // Remarks
        ];

        // Style the header
        worksheet.getRow(5).eachCell(cell => { // Row 5 because of the title and subtitle
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
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber > 5) { // Skip header row and above
            row.eachCell(cell => {
              cell.alignment = { vertical: 'middle', horizontal: 'left' };
              cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
              };
            });
          }
        });

        // Add some spacing after the table
        worksheet.addRow([]);

        // Add filter and totals
        const totalItems = data.data.length;
        worksheet.addRow(['CATEGORY:', categoryDisplay]);
        worksheet.addRow(['PROGRAM:', selectedProgram]); // Add program info
        worksheet.addRow(['MATERIALS COUNT:', totalItems.toString()]);
        worksheet.addRow(['REPORT GENERATED ON:', this.currentDateYearService
                .getCurrentYearAndDate('get_date')]);

        // Style footer
        const footerRowNumbers = [worksheet.lastRow.number - 2, worksheet.lastRow.number - 1, worksheet.lastRow.number];
        footerRowNumbers.forEach(rowNum => {
          worksheet.getRow(rowNum).eachCell({ includeEmpty: false }, cell => {
            cell.font = { bold: true, color: { argb: 'FF800000' } };
            cell.alignment = { horizontal: 'left' };
          });
        });

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `PUPT_Inventory_Report_${this.currentDateYearService
                .getCurrentYearAndDate('get_date')}.xlsx`);

        callback(false);
      },
      error => {
        console.error('Error generating Excel:', error);
        callback(false);
      }
    );
  }
}

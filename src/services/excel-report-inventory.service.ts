import { Injectable } from '@angular/core';
import { ReportsService } from './reports.service'; 
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable()
export class ExcelReportInventoryService {

  constructor(private reportsService: ReportsService) { }

  async generateExcelReport(category: string, callback: (loading: boolean) => void) {
    callback(true);

    this.reportsService.getMaterials(category).subscribe(
      async data => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory Report');

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

        callback(false);
      },
      error => {
        console.error('Error generating Excel:', error);
        callback(false);
      }
    );
  }
}

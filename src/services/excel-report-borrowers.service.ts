import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ReturnService } from './return.service';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelReportBorrowersService {

  constructor(private returnService: ReturnService, 
              private currentDateYearService: CurrentDateYearService) { }

  async generateExcelReport(dateFrom: string | null, dateTo: string | null, 
        setLoading: (loading: boolean) => void) {
    setLoading(true);

    this.returnService.getBorrowingData(dateFrom, dateTo).subscribe(
      async response => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Borrowers Report');

        // Title
        const title = "Polytechnic University of the Philippines - Taguig Campus";
        const subtitle = "PUPT BORROWERS REPORT";
        const dateAndTime = `YEAR AS OF ${this.currentDateYearService
              .getCurrentYearAndDate('no_date')}`;

        // Add title and merge cells
        worksheet.mergeCells('A1:H1');
        worksheet.getCell('A1').value = title;
        worksheet.getCell('A1').font = { bold: true, size: 16, 
              color: { argb: 'FF800000' } };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        // Add subtitle and merge cells
        worksheet.mergeCells('A2:H2');
        worksheet.getCell('A2').value = subtitle;
        worksheet.getCell('A2').font = { bold: true, size: 12, 
              color: { argb: 'FF000000' } };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        // Add date and merge cells
        worksheet.mergeCells('A3:H3');
        worksheet.getCell('A3').value = dateAndTime;
        worksheet.getCell('A3').font = { bold: false, size: 12, 
              color: { argb: 'FF252525' } };
        worksheet.getCell('A3').alignment = { horizontal: 'center' };

        // Add some spacing before the table
        worksheet.addRow([]);

        // Add header row
        worksheet.addRow(['Title', 'Author', 'User Type', 'Name', 'Course',
                          'Claim Date', 'Due Date', 'Remark']);

        // Add data rows
        response.forEach((borrower: any) => {
          worksheet.addRow([
            borrower.title,
            borrower.author,
            borrower.user_type,
            `${borrower.first_name} ${borrower.surname}`,
            borrower.course_department,
            borrower.claim_date,
            borrower.due_date,
            borrower.remark
          ]);
        });

        // Set column widths
        worksheet.columns = [
          { width: 60 }, // Title
          { width: 60 }, // Author
          { width: 20 }, // User Type
          { width: 45 }, // Name
          { width: 20 }, // Course
          { width: 30 }, // Claim Date
          { width: 30 }, // Due Date
          { width: 30 }  // Remark
        ];

        // Style the header
        worksheet.getRow(5).eachCell(cell => {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF800000' } };
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

        // Add footer with total records and date generated
        const totalRecords = `Total Borrowers Records: ${response.length}`;
        const reportGenerated = `Report Generated On: ${this.currentDateYearService
              .getCurrentYearAndDate('get_date')}`;
        const filterRange = dateFrom && dateTo ? 
          `Borrowing Data From: ${this.currentDateYearService
              .formatDateString(dateFrom)} - ${this.currentDateYearService
              .formatDateString(dateTo)}` : '';

        worksheet.addRow([totalRecords]);
        worksheet.addRow([reportGenerated]);
        if (filterRange) {
          worksheet.addRow([filterRange]);
        }

        // Style footer
        const footerRowNumbers = [worksheet.lastRow.number - 2, worksheet
              .lastRow.number - 1, worksheet.lastRow.number];
        footerRowNumbers.forEach(rowNum => {
          worksheet.getRow(rowNum).eachCell({ includeEmpty: false }, cell => {
            cell.font = { bold: true, color: { argb: 'FF800000' } };
            cell.alignment = { horizontal: 'left' };
          });
        });

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `PUPT_Borrowers_Report_${this.currentDateYearService
              .getCurrentYearAndDate('get_date')}.xlsx`);

        setLoading(false);
      },
      error => {
        console.error('Error generating Excel:', error);
        setLoading(false);
      }
    );
  }
}

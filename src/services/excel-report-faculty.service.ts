import { Injectable } from '@angular/core';
import { RecordsService } from './records.service'; 
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable()
export class ExcelReportFacultyService {

  constructor(private recordsService: RecordsService, 
              private currentDateYearService: CurrentDateYearService) { }

  async generateExcel(dateFrom: string | null, dateTo: string | null, setLoading: (loading: boolean) => void) {
    setLoading(true);

    this.recordsService.getLogs('faculty', 10, 1, dateFrom, dateTo).subscribe(
      async response => {
        const facultyData = response?.records || [];

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Faculty Time Logs');

        // Title
        const title = "Polytechnic University of the Philippines - Taguig Campus";
        const subtitle = "PUPT FACULTY TIME LOGS";
        const dateAndTime = `YEAR AS OF ${this.currentDateYearService.getCurrentYearAndDate('no_date')}`;

        // Add title and merge cells
        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = title;
        worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF800000' } };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        
        // Add subtitle and merge cells
        worksheet.mergeCells('A2:E2');
        worksheet.getCell('A2').value = subtitle;
        worksheet.getCell('A2').font = { bold: true, size: 12, color: { argb: 'FF000000' } };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };
        
        // Add date and merge cells
        worksheet.mergeCells('A3:E3');
        worksheet.getCell('A3').value = dateAndTime;
        worksheet.getCell('A3').font = { bold: false, size: 12, color: { argb: 'FF252525' } };
        worksheet.getCell('A3').alignment = { horizontal: 'center' };

        // Add some spacing before the table
        worksheet.addRow([]);

        // Add header row
        worksheet.addRow(['Faculty Code', 'Name', 'Department', 'Time In', 'Time Out']);

        // Add data rows
        facultyData.forEach((faculty: any) => {
          worksheet.addRow([
            faculty.faculty_code,
            faculty.name,
            faculty.department,
            faculty.time_in,
            faculty.time_out ? faculty.time_out : 'await'
          ]);
        });

        // Set column widths
        worksheet.columns = [
          { width: 25 }, // Faculty Code
          { width: 40 }, // Name
          { width: 35 }, // Department
          { width: 20 }, // Time In
          { width: 20 }  // Time Out
        ];

        // Style the header
        worksheet.getRow(5).eachCell(cell => {
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

        // Add footer information
        const footerStartRow = worksheet.lastRow.number + 1;
        const totalRecords = `Total Faculty Records: ${facultyData.length}`;
        const reportGenerated = `Report Generated On: ${this.currentDateYearService.getCurrentYearAndDate('get_date')}`;
        const filterRange = dateFrom && dateTo ? 
          `Time Log Ranging From: ${this.currentDateYearService.formatDateString(dateFrom)} - ${this.currentDateYearService.formatDateString(dateTo)}` : '';

        worksheet.addRow([totalRecords]);
        worksheet.addRow([reportGenerated]);
        if (filterRange) {
          worksheet.addRow([filterRange]);
        }

        // Style footer
        const footerRowNumbers = [footerStartRow, footerStartRow + 1, filterRange ? footerStartRow + 2 : footerStartRow + 1];
        footerRowNumbers.forEach(rowNum => {
          worksheet.getRow(rowNum).eachCell({ includeEmpty: false }, cell => {
            cell.font = { bold: true, color: { argb: 'FF800000' } };
            cell.alignment = { horizontal: 'left' };
          });
        });

        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Faculty_Time_Logs_${this.currentDateYearService.getCurrentYearAndDate('get_date')}.xlsx`);

        setLoading(false);
      },
      error => {
        console.error('Error generating Excel:', error);
        setLoading(false);
      }
    );
  }
}

import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { RecordsService } from './records.service';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelReportStudentsService {

  constructor(private recordsService: RecordsService, 
              private currentDateYearService: CurrentDateYearService) { }

  async generateExcelReport(dateFrom: string | null, dateTo: string | null, setLoading: (loading: boolean) => void) {
    setLoading(true);

    this.recordsService.getLogs('student', 10, 1, dateFrom, dateTo).subscribe(
      async response => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Student Time Logs Report');

        // Title
        const title = "Polytechnic University of the Philippines - Taguig Campus";
        const subtitle = "PUPT STUDENT TIME LOGS";
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
        worksheet.addRow(['Student No.', 'Name', 'Department', 'Time In', 'Time Out']);

        // Add data rows
        const studentData = response?.records || [];
        studentData.forEach((student: any) => {
          worksheet.addRow([
            student.student_number,
            student.name,
            student.course,
            student.time_in,
            student.time_out ? student.time_out : 'await'
          ]);
        });

        // Set column widths
        worksheet.columns = [
          { width: 40 }, // Student No.
          { width: 70 }, // Name
          { width: 40 }, // Department
          { width: 60 }, // Time In
          { width: 60 }  // Time Out
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
        const totalRecords = `Total Student Records: ${studentData.length}`;
        const reportGenerated = `Report Generated On: ${this.currentDateYearService.getCurrentYearAndDate('get_date')}`;
        const filterRange = dateFrom && dateTo ? 
          `Time Log Ranging From: ${this.currentDateYearService.formatDateString(dateFrom)} - ${this.currentDateYearService.formatDateString(dateTo)}` : '';

        worksheet.addRow([totalRecords]);
        worksheet.addRow([reportGenerated]);
        if (filterRange) {
          worksheet.addRow([filterRange]);
        }

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
        saveAs(blob, `PUPT_Student_Time_Logs_Report_${this.currentDateYearService.getCurrentYearAndDate('get_date')}.xlsx`);

        setLoading(false);
      },
      error => {
        console.error('Error generating Excel:', error);
        setLoading(false);
      }
    );
  }
}

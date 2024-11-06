import { Injectable } from '@angular/core';
import { RecordsService } from './records.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CurrentDateYearService } from './current-date-year.service';

@Injectable()
export class ExcelReportEmployeesService {

  constructor(
    private recordsService: RecordsService, 
    private currentDateYearService: CurrentDateYearService
  ) {}

  async generateExcelReport(dateFrom: string | null, dateTo: string | null, setLoading: (loading: boolean) => void) {
    setLoading(true);

    try {
      const allFacultyData = await this.fetchAllFacultyLogs(dateFrom, dateTo);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Faculty Time Logs');

      // Titles
      const title = "Polytechnic University of the Philippines - Taguig Campus";
      const subtitle = "PUPT FACULTY TIME LOGS";
      const dateAndTime = `YEAR AS OF ${this.currentDateYearService.getCurrentYearAndDate('no_date')}`;

      // Add title and merge cells
      worksheet.mergeCells('A1:E1');
      worksheet.getCell('A1').value = title;
      worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF800000' } };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      // Add subtitle and date
      worksheet.mergeCells('A2:E2');
      worksheet.getCell('A2').value = subtitle;
      worksheet.getCell('A2').font = { bold: true, size: 12, color: { argb: 'FF000000' } };
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      worksheet.mergeCells('A3:E3');
      worksheet.getCell('A3').value = dateAndTime;
      worksheet.getCell('A3').font = { bold: false, size: 12, color: { argb: 'FF252525' } };
      worksheet.getCell('A3').alignment = { horizontal: 'center' };

      worksheet.addRow([]);

      // Add header row
      worksheet.addRow(['Faculty Code', 'Name', 'Time In', 'Time Out']);

      // Populate data rows
      allFacultyData.forEach((faculty: any) => {
        worksheet.addRow([
          faculty.employee_number,
          faculty.name,
          faculty.time_in,
          faculty.time_out ? faculty.time_out : 'await'
        ]);
      });

      // Column widths
      worksheet.columns = [
        { width: 25 },
        { width: 40 },
        { width: 35 },
        { width: 35 }
      ];

      // Style headers
      worksheet.getRow(5).eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF800000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Style data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 5) { // Skip title and header rows
          row.eachCell(cell => {
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });
        }
      });

      worksheet.addRow([]);

      // Footer information
      const footerStartRow = worksheet.lastRow.number + 1;
      worksheet.addRow([`Total Faculty Records: ${allFacultyData.length}`]);
      worksheet.addRow([`Report Generated On: ${this.currentDateYearService.getCurrentYearAndDate('get_date')}`]);

      if (dateFrom && dateTo) {
        worksheet.addRow([`Time Log Ranging From: ${this.currentDateYearService.formatDateString(dateFrom)} - ${this.currentDateYearService.formatDateString(dateTo)}`]);
      }

      // Footer style
      for (let i = footerStartRow; i <= worksheet.lastRow.number; i++) {
        worksheet.getRow(i).eachCell(cell => {
          cell.font = { bold: true, color: { argb: 'FF800000' } };
          cell.alignment = { horizontal: 'left' };
        });
      }

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, `Faculty_Time_Logs_${this.currentDateYearService.getCurrentYearAndDate('get_date')}.xlsx`);

    } catch (error) {
      console.error('Error generating Excel:', error);
    } finally {
      setLoading(false);
    }
  }

  private async fetchAllFacultyLogs(dateFrom: string | null, dateTo: string | null): Promise<any[]> {
    let allRecords: any[] = [];
    let page = 1;
    const pageSize = 10;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const response = await this.recordsService.getLogsReports('pupt-employee', pageSize, page, dateFrom, dateTo).toPromise();
      const records = response?.records || [];
      allRecords = allRecords.concat(records);

      if (records.length < pageSize) {
        hasMoreRecords = false;
      } else {
        page++;
      }
    }
    return allRecords;
  }
}

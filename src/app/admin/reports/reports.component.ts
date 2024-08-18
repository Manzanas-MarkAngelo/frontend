import { Component, OnInit } from '@angular/core';
import { PdfReportFacultyService } from '../../../services/pdf-report-faculty.service';
import { PdfReportInventoryService } from '../../../services/pdf-report-inventory.service';
import { PdfReportStudentsService } from '../../../services/pdf-report-students.service';
import { PdfReportVisitorsService } from '../../../services/pdf-report-visitors.service';
import { ExcelReportInventoryService } from '../../../services/excel-report-inventory.service';
import { MaterialsService } from '../../../services/materials.service';
import { PdfReportBorrowersService } from '../../../services/pdf-report-borrowers.service';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  inventoryPlaceholder: string = 'Inventory';
  categoryPlaceholder: string = 'Category';
  programPlaceholder: string = 'Program';
  category: string = '';
  isLoading: boolean = false;
  categories: { mat_type: string, accession_no: string }[] = [];
  showInitialDisplay: boolean = true;
  totalItems: number = 0;
  dateFrom: string | null = null;
  dateTo: string | null = null;

  constructor(
    private pdfReportFacultyService: PdfReportFacultyService,
    private pdfReportInventoryService: PdfReportInventoryService,
    private pdfReportStudentsService: PdfReportStudentsService,
    private excelInventoryReportService: ExcelReportInventoryService,
    private materialService: MaterialsService,
    private pdfReportVisitorsService: PdfReportVisitorsService,
    private pdfReportBorrowersService: PdfReportBorrowersService,
  ) {}

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
    this.categoryPlaceholder = value;
    this.category = this.mapCategoryToAccessionNumber(value);
  }

  mapCategoryToAccessionNumber(selectedType: string): string {
    if (selectedType === 'All') {
      return '';
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

  selectPdfReport() {
    switch(this.inventoryPlaceholder) {

      case 'Inventory':
            this.generatePdfInventoryReport();
            break;
      case 'Borrowers':
            this.generatePdfBorrowersReport()
            break;
      case 'Students':
            this.generatePdfStudentsReport();
            break;
      case 'Faculty':
            this.generatePdfFacultyReport();
            break;      
      case 'Visitors':
            this.generatePdfVisitorsReport()
            break;              
    }
  }

  selectExcelReport() {
    switch(this.inventoryPlaceholder) {

      case 'Inventory':
            this.generateExcelInventoryReport();
            break;
      case 'Borrowers':
            console.log('Borrowers');
            break;
      case 'Students':
            console.log('Students');
            break;
      case 'Faculty':
            console.log('Faculty');
            break;      
      case 'Visitors':
            console.log('Visitors');
            break;              
    }
  }
  generatePdfInventoryReport() {
    this.pdfReportInventoryService.generatePDF(
      this.categoryPlaceholder === 'Category' ? '' : this.category,
      'pdf-preview',
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show
    );
  }
  //Fomat date to match date format in time_logs table in the database
  formatDate(date: string | null): string | null {
    if (!date) return null;
    const parsedDate = new Date(date);
    return `${parsedDate.getFullYear()}-${('0' + (parsedDate.getMonth() + 1))
        .slice(-2)}-${('0' + parsedDate.getDate()).slice(-2)}`;
  }

  generatePdfBorrowersReport() {
    this.pdfReportBorrowersService.generatePDF(
      'pdf-preview',
      this.formatDate(this.dateFrom),
      this.formatDate(this.dateTo),
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show
    );
  }

  generatePdfFacultyReport() {
    console.log('Formatted dateFrom:', this.formatDate(this.dateFrom));
    console.log('Formatted dateTo:', this.formatDate(this.dateTo));
  
    this.pdfReportFacultyService.generatePDF(
      'pdf-preview',
      this.formatDate(this.dateFrom),
      this.formatDate(this.dateTo),
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show
    );
  }
  
  generatePdfStudentsReport() {
    this.pdfReportStudentsService.generatePDF(
      'pdf-preview',
      this.formatDate(this.dateFrom),
      this.formatDate(this.dateTo),
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show
    );
  }

  generatePdfVisitorsReport() {
    this.pdfReportVisitorsService.generatePDF(
      'pdf-preview',
      this.formatDate(this.dateFrom),
      this.formatDate(this.dateTo),
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show
    );
  }

  generateExcelInventoryReport() {
    this.excelInventoryReportService.generateExcelReport(
      this.categoryPlaceholder === 'Category' ? '' : this.category,
      (loading) => this.isLoading = loading
    );
  }
}

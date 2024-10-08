import { Component, OnInit } from '@angular/core';
import { PdfReportFacultyService } from '../../../services/pdf-report-faculty.service';
import { PdfReportInventoryService } from '../../../services/pdf-report-inventory.service';
import { PdfReportStudentsService } from '../../../services/pdf-report-students.service';
import { PdfReportVisitorsService } from '../../../services/pdf-report-visitors.service';
import { PdfReportBorrowersService } from '../../../services/pdf-report-borrowers.service';
import { ExcelReportInventoryService } from '../../../services/excel-report-inventory.service';
import { ExcelReportFacultyService } from '../../../services/excel-report-faculty.service';
import { ExcelReportStudentsService } from '../../../services/excel-report-students.service';
import { ExcelReportVisitorsService } from '../../../services/excel-report-visitors.service';
import { ExcelReportBorrowersService } from '../../../services/excel-report-borrowers.service';
import { MaterialsService } from '../../../services/materials.service';
import { ReportsService } from '../../../services/reports.service';

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
  programs: string[] = [];  // For storing fetched programs
  isLoading: boolean = false;
  categories: { mat_type: string, accession_no: string }[] = [];
  showInitialDisplay: boolean = true;
  totalItems: number = 0;
  dateFrom: string | null = null;
  dateTo: string | null = null;
  categoryPDFDIsplay = '';
  programValue;

  constructor(
    private pdfReportFacultyService: PdfReportFacultyService,
    private pdfReportInventoryService: PdfReportInventoryService,
    private pdfReportStudentsService: PdfReportStudentsService,
    private excelInventoryReportService: ExcelReportInventoryService,
    private materialService: MaterialsService,
    private pdfReportVisitorsService: PdfReportVisitorsService,
    private pdfReportBorrowersService: PdfReportBorrowersService,
    private excelReportFacultyService: ExcelReportFacultyService,
    private excelReportBorrowersService: ExcelReportBorrowersService,
    private excelReportStudentsService: ExcelReportStudentsService,
    private excelReportVisitorsService: ExcelReportVisitorsService,
    private reportsService: ReportsService,
  ) {}

  ngOnInit() {
    this.fetchCategories();
    this.fetchPrograms();
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

    // New method to fetch programs from the backend
    fetchPrograms() {
      this.reportsService.getDepartments().subscribe(
        data => {
          this.programs = data.map((department: any) => department.dept_program);  // Extract program names
        },
        error => {
          console.error('Error fetching programs:', error);
        }
      );
    }

  InventoryPlaceholder(value: string) {
    this.inventoryPlaceholder = value;
  }

  CategoryPlaceholder(value: string) {
    this.categoryPlaceholder = value;
    this.categoryPDFDIsplay = this.categoryPlaceholder;
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
    this.fetchMaterialsByProgram(value);
  }

  // New method to fetch materials filtered by program
  fetchMaterialsByProgram(program: string) {
    console.log('Selected Program:', program);
    const page = 1;  // Example: Default page
    const limit = 12;  // Example: Default limit
    const sortField = 'date_added';  // Example: Default sorting field
    const sortOrder = 'DESC';  // Example: Default sorting order
    this.programValue = program;
    this.materialService.filterMaterialsByCategory(program, page, limit, sortField, sortOrder).subscribe(
      (response) => {
        // Handle the response here (e.g., store the materials in a component variable)
        console.log('Filtered materials by program:', response);
      },
      (error) => {
        console.error('Error fetching filtered materials:', error);
      }
    );
  }

  getCurrentYearAndDate(option: 'get_date' | 'no_date'): string {
    const now = new Date();
    const year = now.getFullYear();
    return option === 'get_date'
      ? `${now.toLocaleString('en-US', { month: 'short' })} ${now.getDate()}, ${year}`
      : `${year}`;
  }

    //Fomat date to match date format in time_logs table in the database
    formatDate(date: string | null): string | null {
      if (!date) return null;
      const parsedDate = new Date(date);
      return `${parsedDate.getFullYear()}-${('0' + (parsedDate.getMonth() + 1))
          .slice(-2)}-${('0' + parsedDate.getDate()).slice(-2)}`;
    }

  //*PDF Generation

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

  // Pass selected program to PDF generation services
  generatePdfInventoryReport() {
    this.pdfReportInventoryService.generatePDF(
      this.categoryPlaceholder === 'Category' ? '' : this.category,
      'pdf-preview',
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show,
      this.categoryPDFDIsplay,
      this.programPlaceholder === 'Program' ? '' : this.programValue  // Pass program
    );
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

  //*Excel Generation

  selectExcelReport() {
    switch(this.inventoryPlaceholder) {

      case 'Inventory':
            this.generateExcelInventoryReport();
            break;
      case 'Borrowers':
            this.generateExcelBorrowersReport();
            break;
      case 'Students':
            this.generateExcelStudentsReport();
            break;
      case 'Faculty':
            this.generateExcelFacultyReport();
            break;      
      case 'Visitors':
            this.generateExcelVisitorsReport();
            break;              
    }
  }

  generateExcelInventoryReport() {
    this.excelInventoryReportService.generateExcelReport(
      this.categoryPlaceholder === 'Category' ? '' : this.category,
      this.programPlaceholder === 'Program' ? '' : this.programPlaceholder, // Pass program filter
      (loading) => this.isLoading = loading,  
      this.categoryPDFDIsplay
    );
  }
  

  generateExcelBorrowersReport() {
    this.excelReportBorrowersService.generateExcelReport(
        this.formatDate(this.dateFrom),
        this.formatDate(this.dateTo),
        (loading) => this.isLoading = loading
    );
  }

  generateExcelStudentsReport() {
    this.excelReportStudentsService.generateExcelReport(
        this.formatDate(this.dateFrom),
        this.formatDate(this.dateTo),
        (loading) => this.isLoading = loading
    );
  }

  generateExcelFacultyReport() {
    this.excelReportFacultyService.generateExcelReport(
        this.formatDate(this.dateFrom),
        this.formatDate(this.dateTo),
        (loading) => this.isLoading = loading
    );
  }

  generateExcelVisitorsReport() {
    this.excelReportVisitorsService.generateExcelReport(
        this.formatDate(this.dateFrom),
        this.formatDate(this.dateTo),
        (loading) => this.isLoading = loading
    );
  }
}

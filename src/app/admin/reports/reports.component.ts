import { Component, OnInit } from '@angular/core';
import { PdfReportFacultyService } from '../../../services/pdf-report-faculty.service';
import { PdfReportInventoryService } from '../../../services/pdf-report-inventory.service';
import { PdfReportStudentsService } from '../../../services/pdf-report-students.service';
import { PdfReportVisitorsService } from '../../../services/pdf-report-visitors.service';
import { PdfReportBorrowersService } from '../../../services/pdf-report-borrowers.service';
import { PdfReportEmployeesService } from '../../../services/pdf-report-employees.service';
import { ExcelReportInventoryService } from '../../../services/excel-report-inventory.service';
import { ExcelReportFacultyService } from '../../../services/excel-report-faculty.service';
import { ExcelReportStudentsService } from '../../../services/excel-report-students.service';
import { ExcelReportEmployeesService } from '../../../services/excel-report-employees.service';
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
  categoryPlaceholder: string = 'Material type';
  programPlaceholder: string = 'Subject';
  selectedRemark: string = '';
  category: string = '';
  programs: string[] = [];
  isLoading: boolean = false;
  categories: { mat_type: string, accession_no: string }[] = [];
  showInitialDisplay: boolean = true;
  totalItems: number = 0;
  dateFrom: string | null = null;
  dateTo: string | null = null;
  categoryPDFDIsplay = '';
  programValue = 'Subject';
  filteredPrograms: string[] = [];
  isProgramDropdownOpen: boolean = false;
  programSearchTerm: string = '';
  selectedProgram: string = '';

  constructor(
    private pdfReportFacultyService: PdfReportFacultyService,
    private pdfReportInventoryService: PdfReportInventoryService,
    private pdfReportStudentsService: PdfReportStudentsService,
    private excelInventoryReportService: ExcelReportInventoryService,
    private materialService: MaterialsService,
    private pdfReportVisitorsService: PdfReportVisitorsService,
    private pdfReportBorrowersService: PdfReportBorrowersService,
    private pdfReportEmployeesService: PdfReportEmployeesService,
    private excelReportFacultyService: ExcelReportFacultyService,
    private excelReportBorrowersService: ExcelReportBorrowersService,
    private excelReportStudentsService: ExcelReportStudentsService,
    private excelReportVisitorsService: ExcelReportVisitorsService,
    private excelReportEmployeesService: ExcelReportEmployeesService,
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

  fetchPrograms() {
    this.reportsService.getDepartments().subscribe(
      data => {
        this.programs = data.map((program: any) => program.subject_name);
        this.filteredPrograms = [...this.programs];
      },
      error => {
        console.error('Error fetching programs:', error);
      }
    );
  }

    toggleProgramDropdown() {
      this.isProgramDropdownOpen = !this.isProgramDropdownOpen;
    }
  
    selectProgram(program: string) {
      this.programPlaceholder = program;
      this.isProgramDropdownOpen = false;
      this.programValue = program;
      
    }
  
    onProgramSearch(term: string) {
      this.filteredPrograms = this.programs.filter(program =>
        program.toLowerCase().includes(term.toLowerCase())
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

  fetchMaterialsByProgram(program: string) {
    const page = 1;
    const limit = 12;
    const sortField = 'date_added';
    const sortOrder = 'DESC';
    this.programValue = program;
    this.materialService.filterMaterialsByCategory(program, page, limit, sortField, sortOrder).subscribe(
      (response) => {
        
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

    formatDate(date: string | null): string | null {
      if (!date) return null;
      const parsedDate = new Date(date);
      return `${parsedDate.getFullYear()}-${('0' + (parsedDate.getMonth() + 1))
          .slice(-2)}-${('0' + parsedDate.getDate()).slice(-2)}`;
    }

  onRemarkSelected(remark: string): void {
    this.selectedRemark = remark;
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
      case 'Employee':
            this.generatePdfEmployeeReport();
            break;    
      case 'Visitors':
            this.generatePdfVisitorsReport()
            break;              
    }
  }

  generatePdfInventoryReport() {
    this.pdfReportInventoryService.generatePDF(
      this.categoryPlaceholder === 'Category' ? '' : this.category,
      'pdf-preview',
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show,
      this.categoryPDFDIsplay,
      this.programPlaceholder === 'Subject' ? '' : this.programValue
    );
  }

  generatePdfBorrowersReport() {
    this.pdfReportBorrowersService.generatePDF(
      'pdf-preview',
      this.formatDate(this.dateFrom),
      this.formatDate(this.dateTo),
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show,
      this.selectedRemark
    );
  }

  generatePdfFacultyReport() {
    this.pdfReportFacultyService.generatePDF(
      'pdf-preview',
      this.formatDate(this.dateFrom),
      this.formatDate(this.dateTo),
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show
    );
  }

  generatePdfEmployeeReport() {
    this.pdfReportEmployeesService.generatePDF(
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

  handleClearButtonClick() {
    this.categoryPlaceholder = 'Category';
    this.programPlaceholder = 'Subject';
    this.selectedRemark = '';
    this.dateFrom = null;
    this.dateTo = null;
  }

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
      case 'Employee':
            this.generateExcelEmployeeReport();
            break;      
      case 'Visitors':
            this.generateExcelVisitorsReport();
            break;              
    }
  }

  generateExcelInventoryReport() {
    this.excelInventoryReportService.generateExcelReport(
      this.categoryPlaceholder === 'Category' ? '' : this.category,
      this.programPlaceholder === 'Subject' ? '' : this.programPlaceholder,
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

  generateExcelEmployeeReport() {
    this.excelReportEmployeesService.generateExcelReport(
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
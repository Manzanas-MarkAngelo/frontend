import { Component, OnInit } from '@angular/core';
import { PdfReportFacultyService } from '../../../services/pdf-report-faculty.service';
import { PdfReportInventoryService } from '../../../services/pdf-report-inventory.service';
import { ExcelReportInventoryService } from '../../../services/excel-report-inventory.service';
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
  category: string = '';
  isLoading: boolean = false;
  categories: { mat_type: string, accession_no: string }[] = [];
  showInitialDisplay: boolean = true;
  totalItems: number = 0;

  constructor(
    private pdfReportFacultyService: PdfReportFacultyService,
    private pdfReportInventoryService: PdfReportInventoryService,
    private excelInventoryReportService: ExcelReportInventoryService,
    private materialService: MaterialsService
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

  generateInventoryReport() {
    this.pdfReportInventoryService.generatePDF(
      this.categoryPlaceholder === 'Category' ? '' : this.category,
      'pdf-preview',
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show
    );
  }

  generateFacultyReport() {
    this.pdfReportFacultyService.generatePDF(
      'pdf-preview',
      (loading) => this.isLoading = loading,
      (show) => this.showInitialDisplay = show
    );
  }

  generateExcelReport() {
    this.excelInventoryReportService.generateExcelReport(
      this.categoryPlaceholder === 'Category' ? '' : this.category,
      (loading) => this.isLoading = loading
    );
  }
}

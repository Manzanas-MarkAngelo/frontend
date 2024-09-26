import { Component, OnInit } from '@angular/core';
import { BorrowService } from '../../../services/borrow.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css']
})
export class BorrowComponent implements OnInit {
  materials: any[] = [];
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 13;
  searchTerm: string = '';
  category: string = '';
  categories: any[] = []; // Added categories array to store category data
  private searchTerms = new Subject<string>();

  categoryPlaceholder: string = 'Choose category';
  sortField: string = 'date_added'; // Default sort field
  sortOrder: string = 'DESC'; // Default sort order

  constructor(private borrowService: BorrowService) {}

  ngOnInit() {
    this.loadMaterials();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.getMaterials(term))
    ).subscribe(response => {
      this.materials = response.data;
      this.totalItems = response.totalItems;
      this.totalPages = response.totalPages;
    });

    // Fetch categories when the component initializes
    this.borrowService.getCategories().subscribe(response => {
      this.categories = response; // Assuming the API returns a list of categories
    });
  }

  trackByAccNum(index: number, material: any): string {
    return material.accnum;
  }

  loadMaterials() {
    if (this.searchTerm) {
      if (this.category) {
        this.borrowService.searchBorrowedMaterialsByCategory(
          this.searchTerm, 
          this.category, 
          this.currentPage, 
          this.itemsPerPage, 
          this.sortField, 
          this.sortOrder
        ).subscribe(response => {
          this.materials = response.data;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
        });
      } else {
        this.borrowService.searchBorrowedMaterials(
          this.searchTerm, 
          this.currentPage, 
          this.itemsPerPage, 
          this.sortField, 
          this.sortOrder
        ).subscribe(response => {
          this.materials = response.data;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
        });
      }
    } else if (this.category) {
      this.borrowService.filterBorrowedMaterialsByCategory(
        this.category, 
        this.currentPage, 
        this.itemsPerPage, 
        this.sortField, 
        this.sortOrder
      ).subscribe(response => {
        this.materials = response.data;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
      });
    } else {
      this.borrowService.getBorrowedMaterials(
        this.currentPage, 
        this.itemsPerPage, 
        this.sortField, 
        this.sortOrder
      ).subscribe(response => {
        this.materials = response.data;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
      });
    }
  }

  getMaterials(term: string) {
    if (this.category) {
      return this.borrowService.searchBorrowedMaterialsByCategory(
        term, 
        this.category, 
        this.currentPage, 
        this.itemsPerPage, 
        this.sortField, 
        this.sortOrder
      );
    } else {
      return this.borrowService.searchBorrowedMaterials(
        term, 
        this.currentPage, 
        this.itemsPerPage, 
        this.sortField, 
        this.sortOrder
      );
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadMaterials();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.searchTerms.next(this.searchTerm);
  }

  CategoryPlaceholder(value: string) {
    this.categoryPlaceholder = value;
    this.category = this.mapCategoryToAccessionNumber(value);
    this.currentPage = 1;
    this.loadMaterials();
  }

  mapCategoryToAccessionNumber(category: string): string {
    const matchedCategory = this.categories.find(cat => cat.mat_type === category);
    return matchedCategory ? matchedCategory.accession_no : '';
  }

  sortMaterials(field: string) {
    if (field === 'accnum') {
      // Special case for sorting by 'Acc No.'
      this.sortField = 'categoryid';
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      if (this.sortField === field) {
        // Toggle the sorting order for the same field
        this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        this.sortField = field;
        this.sortOrder = 'DESC';
      }
    }

    // Reload materials with the updated sorting
    this.loadMaterials();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.category = '';
    this.currentPage = 1;
    this.categoryPlaceholder = 'Choose category';
    this.sortField = 'date_added'; // Reset to default sort field
    this.sortOrder = 'DESC'; // Reset to default sort order
    this.loadMaterials();
  }
}

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
  itemsPerPage: number = 12;
  searchTerm: string = '';
  category: string = '';
  private searchTerms = new Subject<string>();

  categoryPlaceholder: string = 'Choose category';

  constructor(private borrowService: BorrowService) {}

  ngOnInit() {
    this.loadMaterials();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (this.category) {
          return this.borrowService.searchBorrowableMaterialsByCategory(
            term, 
            this.category, 
            this.currentPage, 
            this.itemsPerPage
          );
        } else {
          return this.borrowService.searchBorrowableMaterials(
            term, 
            this.currentPage, 
            this.itemsPerPage
          );
        }
      })
    ).subscribe(response => {
      this.materials = response.data;
      this.totalItems = response.totalItems;
      this.totalPages = response.totalPages;
    });
  }

  loadMaterials() {
    if (this.searchTerm) {
      if (this.category) {
        this.borrowService.searchBorrowableMaterialsByCategory(
          this.searchTerm, 
          this.category, 
          this.currentPage, 
          this.itemsPerPage
        )
          .subscribe(response => {
            this.materials = response.data;
            this.totalItems = response.totalItems;
            this.totalPages = response.totalPages;
          });
      } else {
        this.borrowService.searchBorrowableMaterials(
          this.searchTerm, 
          this.currentPage, 
          this.itemsPerPage
        )
          .subscribe(response => {
            this.materials = response.data;
            this.totalItems = response.totalItems;
            this.totalPages = response.totalPages;
          });
      }
    } else if (this.category) {
      this.borrowService.filterBorrowableMaterialsByCategory(
        this.category, 
        this.currentPage, 
        this.itemsPerPage
      )
        .subscribe(response => {
          this.materials = response.data;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
        });
    } else {
      this.borrowService.getBorrowableMaterials(
        this.currentPage, 
        this.itemsPerPage
      )
        .subscribe(response => {
          this.materials = response.data;
          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
        });
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
    this.loadMaterials();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.category = '';
    this.currentPage = 1;
    this.categoryPlaceholder = 'Choose category';
    this.loadMaterials();
  }

  mapCategoryToAccessionNumber(category: string): string {
    const categoryMap = {
      'Filipiñana': 'PUPT Fili',
      'Circulation': 'PUPT Circ',
      'Fiction': 'PUPT Fic',
      'Donations': 'PUPT Don',
    };
    return categoryMap[category] || '';
  }
}
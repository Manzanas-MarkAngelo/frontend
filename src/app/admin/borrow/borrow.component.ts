import { Component, OnInit } from '@angular/core';
import { MaterialsService } from '../../../services/materials.service';
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
  itemsPerPage: number = 14;
  searchTerm: string = '';
  private searchTerms = new Subject<string>();

  categoryPlaceholder: string = 'Choose category';

  constructor(private materialsService: MaterialsService) {}

  ngOnInit() {
    this.loadMaterials();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.materialsService
          .searchMaterials(term, this.currentPage, this.itemsPerPage))
    ).subscribe(response => {
      this.materials = response.data;
      this.totalItems = response.totalItems;
      this.totalPages = response.totalPages;
    });
  }

  loadMaterials() {
    if (this.searchTerm) {
      this.materialsService.searchMaterials(this.searchTerm, 
            this.currentPage, this.itemsPerPage).subscribe(response => {
        this.materials = response.data;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
      });
    } else {
      this.materialsService.getMaterials(this.currentPage, this.itemsPerPage)
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
    this.currentPage = 1;  // Reset to the first page on new search
    this.searchTerms.next(this.searchTerm);
  }

  CategoryPlaceholder(value: string) {
    this.categoryPlaceholder = value;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }
}

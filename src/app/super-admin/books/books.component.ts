import { Component } from '@angular/core';
import { MaterialsService } from '../../../services/materials.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  materials: any[] = [];
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 12;
  searchTerm: string = '';
  category: string = '';
  private searchTerms = new Subject<string>();

  categoryPlaceholder: string = 'Choose category';

  constructor(private materialsService: MaterialsService, 
      private router: Router) {}

  navigateToDetails(accnum: string) {
    this.router.navigate(['/borrow-info', accnum]);
  }

  ngOnInit() {
    this.loadMaterials();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (this.category) {
          return this.materialsService.searchMaterialsByCategory(term, 
              this.category, this.currentPage, this.itemsPerPage);
        } else {
          return this.materialsService.searchMaterials(term, 
              this.currentPage, this.itemsPerPage);
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
        this.materialsService.searchMaterialsByCategory(this.searchTerm, 
              this.category, this.currentPage, this.itemsPerPage)
          .subscribe(response => {
            this.materials = response.data;
            this.totalItems = response.totalItems;
            this.totalPages = response.totalPages;
          });
      } else {
        this.materialsService.searchMaterials(this.searchTerm, 
              this.currentPage, this.itemsPerPage)
          .subscribe(response => {
            this.materials = response.data;
            this.totalItems = response.totalItems;
            this.totalPages = response.totalPages;
          });
      }
    } else if (this.category) {
      this.materialsService.filterMaterialsByCategory(this.category, 
            this.currentPage, this.itemsPerPage)
        .subscribe(response => {
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
    this.currentPage = 1;
    this.searchTerms.next(this.searchTerm);
  }

  CategoryPlaceholder(value: string) {
    this.categoryPlaceholder = value;
    this.category = this.mapCategoryToAccessionNumber(value);
    this.loadMaterials();
  }

  mapCategoryToAccessionNumber(category: string): string {
    const categoryMap = {
      'Filipiñana': 'PUPT Fili',
      'Circulation': 'PUPT Circ',
      'Fiction': 'PUPT Fic',
      'Reference': 'PUPT Ref',
      'Thesis/Dissertations': 'PUPT TH/D',
      'Feasibility': 'PUPT Feas',
      'Donations': 'PUPT Don',
      'E-Book': 'PUPT EB',
      'PDF': 'PUPT pdf',
      'Business Plan': 'PUPTBP',
      'Case Study': 'PUPTCS',
      'Training Manual': 'PUPTTM',
      'OJT/Internship': 'PUPTOJT/I'
    };
    return categoryMap[category] || '';
  }
}
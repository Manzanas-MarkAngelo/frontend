import { Component } from '@angular/core';
import { MaterialsService } from '../../../services/materials.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
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
  showModal: boolean = false;
  selectedMaterialId: number | null = null;
  selectedMaterialTitle = ''

  categoryPlaceholder: string = 'Choose category';

  // Snackbar variables
  snackBarVisible: boolean = false;
  snackBarMessage: string = '';

  constructor(private materialsService: MaterialsService, 
              private router: Router) {}

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
          return this.materialsService.searchMaterials(term, this.currentPage, 
                this.itemsPerPage);
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

  navigateToDetails(accnum: string) {
    this.router.navigate(['/borrow-info', accnum]);
  }

  showConfirmModal(id: number, title: string): void {
    this.selectedMaterialId = id;
    this.selectedMaterialTitle = title;
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
    this.selectedMaterialId = null;
  }

  deleteMaterial(): void {
    if (this.selectedMaterialId !== null) {
      this.materialsService.deleteMaterial(this.selectedMaterialId)
            .subscribe(response => {
        if (response.status === 'success') {
          this.materials = this.materials.filter(material => 
                material.id !== this.selectedMaterialId);
          this.snackBarMessage = `Material ${this.selectedMaterialTitle} deleted successfully`;
          this.snackBarVisible = true;
          setTimeout(() => {
            this.snackBarVisible = false;
          }, 5000); // Snackbar visible for 3 seconds
          this.closeConfirmModal();
        } else {
          this.snackBarMessage = 'Failed to delete material';
          this.snackBarVisible = true;
          setTimeout(() => {
            this.snackBarVisible = false;
          }, 3000);
        }
      });
    }
  }

  closeSnackBar() {
    this.snackBarVisible = false;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.category = '';
    this.currentPage = 1; 
    this.categoryPlaceholder = 'Choose category';
    this.loadMaterials();
  }
}

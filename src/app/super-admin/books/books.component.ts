import { Component, OnInit } from '@angular/core';
import { MaterialsService } from '../../../services/materials.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  materials: any[] = [];
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 11;
  searchTerm: string = '';
  category: string = '';
  private searchTerms = new Subject<string>();
  showModal: boolean = false;
  selectedMaterialId: number | null = null;
  selectedMaterialTitle = '';

  categoryPlaceholder: string = 'Choose category';
  categories: { mat_type: string, accession_no: string }[] = [];

  snackBarVisible: boolean = false;
  snackBarMessage: string = '';

  sortField: string = 'date_added'; // Default sort field
  sortOrder: string = 'DESC'; // Default sort order

    // Checkbox logic
    selectAllChecked: boolean = false; // Header checkbox state

  constructor(private materialsService: MaterialsService, private router: Router) {}

  ngOnInit() {
    this.loadMaterials(); 
    this.loadCategories(); 

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.getMaterials(term))
    ).subscribe(response => {
      this.materials = response.data;
      this.totalItems = response.totalItems;
      this.totalPages = response.totalPages;
    });
  }

    // Checkbox Selection Logic

    toggleAllSelection(event: any) {
      const isChecked = event.target.checked;
      this.materials.forEach(material => {
        material.selected = isChecked;
      });
    }
  
    checkIfAllSelected() {
      this.selectAllChecked = this.materials.every(material => material.selected);
    }

  loadMaterials() {
    if (this.searchTerm) {
      if (this.category) {
        this.materialsService.searchMaterialsByCategory(
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
        this.materialsService.searchMaterials(
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
      // Ensure you are filtering by category and sorting by categoryid
      this.materialsService.filterMaterialsByCategory(
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
      this.materialsService.getMaterials(
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
      return this.materialsService.searchMaterialsByCategory(
        term, 
        this.category, 
        this.currentPage, 
        this.itemsPerPage, 
        this.sortField, 
        this.sortOrder
      );
    } else {
      return this.materialsService.searchMaterials(
        term, 
        this.currentPage, 
        this.itemsPerPage, 
        this.sortField, 
        this.sortOrder
      );
    }
  }

  loadCategories(): void {
    this.materialsService.getCategories().subscribe(data => {
      this.categories = data;
    }, error => {
      console.error('Error fetching categories:', error);
    });
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
            this.materials = this.materials.filter(material => material.id !== this.selectedMaterialId);
            this.snackBarMessage = `Material ${this.selectedMaterialTitle} deleted successfully`;
            this.snackBarVisible = true;
            setTimeout(() => {
              this.snackBarVisible = false;
            }, 5000); // Snackbar visible for 5 seconds
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
    this.sortField = 'date_added'; // Reset to default sort field
    this.sortOrder = 'DESC'; // Reset to default sort order
    this.loadMaterials();
  }

  sortMaterials(field: string) {
    // Special case for sorting by 'Acc No.'
    if (field === 'accnum') {
      // Toggle the sorting order for 'categoryid'
      this.sortField = 'categoryid';
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      // Toggle the sorting order for the same field
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        // Set the new sorting field and default to 'DESC'
        this.sortField = field;
        this.sortOrder = 'DESC';
      }
    }
    
    // Log current sortField and sortOrder for debugging
    console.log(`Sorting by ${this.sortField} ${this.sortOrder}`);
    
    // Reload materials with the updated sorting
    this.loadMaterials();
  }
  
  
}

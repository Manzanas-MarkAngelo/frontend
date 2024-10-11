import { Component, OnInit } from '@angular/core';
import { MaterialsService } from '../../../services/materials.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.css'
})
export class MaterialsComponent {
  materials: any[] = [];
  totalItems: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100, 500, 1000];
  searchTerm: string = '';
  category: string = '';
  private searchTerms = new Subject<string>();
  showModal: boolean = false;
  selectedMaterialId: number | null = null;
  selectedMaterialTitle = '';
  isDisabled = true;

  categoryPlaceholder: string = 'Choose category';
  categories: { mat_type: string, accession_no: string }[] = [];

  snackBarVisible: boolean = false;
  snackBarMessage: string = '';

  sortField: string = 'date_added';
  sortOrder: string = 'DESC';

  selectedMaterialIds: number[] = [];
  selectAllChecked: boolean = false;

  constructor(
    private materialsService: MaterialsService, 
    private router: Router
  ) {}

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

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.loadMaterials();
  }

  toggleMaterialSelection(material: any) {
    if (material.status === 'Weed Out' || material.status === 'Charged') {
      return;
    }
  
    if (this.selectedMaterialIds.includes(material.id)) {
      this.selectedMaterialIds = this.selectedMaterialIds
        .filter(id => id !== material.id);
    } else {
      this.selectedMaterialIds.push(material.id);
    }
  
    this.checkIfAllSelected();
    this.checkIfAnySelected();
  }  

  toggleAllSelection(event: any) {
    const isChecked = event.target.checked;
  
    if (isChecked) {
      this.materials.forEach(material => {
        if (
          material.status !== 'Weed Out' && 
          material.status !== 'Charged' && 
          !this.selectedMaterialIds.includes(material.id)
        ) {
          this.selectedMaterialIds.push(material.id);
        }
        if (material.status !== 'Weed Out' && material.status !== 'Charged') {
          material.selected = true;
        }
      });
    } else {
      this.materials.forEach(material => {
        if (material.status !== 'Weed Out' && material.status !== 'Charged') {
          this.selectedMaterialIds = this.selectedMaterialIds
            .filter(id => id !== material.id);
          material.selected = false;
        }
      });
    }
  
    this.checkIfAllSelected();
    this.checkIfAnySelected();
  }  

  restoreSelectedCheckboxes() {
    this.materials.forEach(material => {
      material.selected = this.selectedMaterialIds.includes(material.id);
    });
  }  

  checkIfAllSelected() {
    const allSelected = this.materials.every(material => 
      material.status === 'Weed Out' || 
      material.status === 'Charged' || 
      this.selectedMaterialIds.includes(material.id)
    );
    this.selectAllChecked = allSelected;
  }
  
  checkIfAnySelected() {
    this.isDisabled = this.selectedMaterialIds.length === 0;
  }  

  confirmWeedOut() {
    const availableMaterialsToWeedOut = this.materials.filter(
      material => 
        this.selectedMaterialIds.includes(material.id) && 
        material.status === 'Available'
    );
  
    if (availableMaterialsToWeedOut.length > 0) {
      const materialIdsToWeedOut = availableMaterialsToWeedOut
        .map(material => material.id);
      
      this.materialsService.weedOutMaterials(materialIdsToWeedOut).subscribe(() => {
        this.loadMaterials();
        
        this.selectedMaterialIds = [];
        this.selectAllChecked = false;
  
        this.materials.forEach(material => {
          material.selected = false;
        });
  
        this.isDisabled = true;
        this.closeWarningModal();
      });
    }
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
  
          this.restoreSelectedCheckboxes();
          this.checkIfAllSelected();
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
  
          this.restoreSelectedCheckboxes();
          this.checkIfAllSelected();
        });
      }
    } else if (this.category) {
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
  
        this.restoreSelectedCheckboxes(); 
        this.checkIfAllSelected();
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
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  
        this.restoreSelectedCheckboxes();
        this.checkIfAllSelected();
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

  clearSearch() {
    this.searchTerm = '';
    this.category = '';
    this.currentPage = 1;
    this.selectedMaterialIds = [];
    this.categoryPlaceholder = 'Choose category';
    this.sortField = 'date_added';
    this.sortOrder = 'DESC';
    this.selectAllChecked = false;
    this.isDisabled = true;
    this.materials.forEach(material => material.selected = false);
    this.loadMaterials();
  }   

  sortMaterials(field: string) {
    if (field === 'accnum') {
      this.sortField = 'categoryid';
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        this.sortField = field;
        this.sortOrder = 'DESC';
      }
    }
    
    this.loadMaterials();
  }

  openWarningModal() {
    (document.getElementById('my_modal_1') as HTMLDialogElement)
      .showModal();
  }

  closeWarningModal() {
    (document.getElementById('my_modal_1') as HTMLDialogElement)
      .close();
  }
}
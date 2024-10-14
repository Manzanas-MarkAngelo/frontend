import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialsService } from '../../../services/materials.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.css'
})
export class MaterialsComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

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
  selectedMaterialTitles: string[] = [];
  selectAllChecked: boolean = false;
  paginatedTitles: string[][] = [];
  currentTitlePage: number = 1;
  totalTitlePages: number = 1;

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
      this.selectedMaterialIds = this.selectedMaterialIds.filter(id => id !== material.id);
      this.selectedMaterialTitles = this.selectedMaterialTitles.filter(title => title !== material.title);
    } else {
      this.selectedMaterialIds.push(material.id);
      this.selectedMaterialTitles.push(material.title);
    }
  
    this.checkIfAllSelected();
    this.checkIfAnySelected();
  
    this.currentTitlePage = 1;
    this.paginateSelectedTitles();
  }
  
  toggleAllSelection(event: any) {
    const isChecked = event.target.checked;
  
    if (isChecked) {
      this.materials.forEach(material => {
        if (material.status !== 'Weed Out' && material.status !== 'Charged' && !this.selectedMaterialIds.includes(material.id)) {
          this.selectedMaterialIds.push(material.id);
          this.selectedMaterialTitles.push(material.title);
        }
      });
    } else {
      this.selectedMaterialIds = [];
      this.selectedMaterialTitles = [];
    }
  
    this.checkIfAllSelected();
    this.checkIfAnySelected();
  
    this.currentTitlePage = 1;
    this.paginateSelectedTitles();
  }  

  paginateSelectedTitles() {
    const titlesPerPage = 10;
    const startIndex = (this.currentTitlePage - 1) * titlesPerPage;
    const endIndex = startIndex + titlesPerPage;
  
    const titlesOnPage = this.selectedMaterialTitles.slice(startIndex, endIndex);
  
    const column1 = titlesOnPage.slice(0, 5);
    const column2 = titlesOnPage.slice(5, 10);
  
    this.paginatedTitles = [column1, column2];
    this.totalTitlePages = Math.ceil(this.selectedMaterialTitles.length / titlesPerPage);
  }

  nextTitlePage() {
    if (this.currentTitlePage < this.totalTitlePages) {
      this.currentTitlePage++;
      this.paginateSelectedTitles();
    }
  }
  
  previousTitlePage() {
    if (this.currentTitlePage > 1) {
      this.currentTitlePage--;
      this.paginateSelectedTitles();
    }
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
      const materialIdsToWeedOut = availableMaterialsToWeedOut.map(material => material.id);
  
      this.materialsService.weedOutMaterials(materialIdsToWeedOut).subscribe(() => {
        this.loadMaterials();

        this.selectedMaterialIds = [];
        this.selectAllChecked = false;
  
        this.materials.forEach(material => {
          material.selected = false;
        });
  
        this.isDisabled = true;
        this.closeWarningModal();
  
        this.snackbar.showMessage('Selected materials marked as "Weed Out" successfully');
      }, () => {
        this.snackbar.showMessage('Failed to mark materials as "Weed Out"');
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
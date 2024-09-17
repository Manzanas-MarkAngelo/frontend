import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialsService } from '../../../services/materials.service';
import { BookRequestService } from '../../../services/book-request.service';
import { ClientSnackbarComponent } from '../client-snackbar/client-snackbar.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.css']
})
export class SearchBookComponent implements OnInit {
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
  selectedMaterialTitle = '';

  categoryPlaceholder: string = 'Choose category';
  categories: { mat_type: string, accession_no: string }[] = [];

  sortField: string = 'date_added';
  sortOrder: string = 'DESC';

  @ViewChild(ClientSnackbarComponent) snackbar: ClientSnackbarComponent;

  request = {
    title: '',
    author: '',
    year_published: '',
    requester_id: '',
    requester_type: 'student'
  };

  formErrorMessage: string = '';

  constructor(
    private materialsService: MaterialsService,
    private bookRequestService: BookRequestService,
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
    this.loadMaterials();
  }

  mapCategoryToAccessionNumber(category: string): string {
    const matchedCategory = this.categories.find(
      cat => cat.mat_type === category
    );
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

  clearSearch(): void {
    this.searchTerm = '';
    this.category = '';
    this.currentPage = 1;
    this.categoryPlaceholder = 'Choose category';
    this.sortField = 'date_added';
    this.sortOrder = 'DESC';
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

  resetForm() {
    this.request = {
      title: '',
      author: '',
      year_published: '',
      requester_id: '',
      requester_type: 'student'
    };
    this.formErrorMessage = '';
  }  

  openRequestModal() {
    (document.getElementById('my_modal_1') as HTMLDialogElement)
      .showModal();
  }

  closeRequestModal() {
    this.resetForm();
    (document.getElementById('my_modal_1') as HTMLDialogElement)
      .close();
  }

  openNotRegisteredModal() {
    (document.getElementById('not_registered_modal') as HTMLDialogElement)
      .showModal();
  }

  closeNotRegisteredModal() {
    (document.getElementById('not_registered_modal') as HTMLDialogElement)
      .close();
  }

  submitRequest() {
    this.formErrorMessage = '';

    if (
      !this.request.title || 
      !this.request.author || 
      !this.request.year_published || 
      !this.request.requester_id
    ) {
      this.formErrorMessage = 
        'Please fill out all the fields before submitting the request.';
      return;
    }

    this.bookRequestService.submitBookRequest(this.request).subscribe(
      response => {
        if (response.success) {
          this.snackbar.showMessage('Book request submitted successfully.');

          this.resetForm();
          this.closeRequestModal();
        } else {
          if (response.message === 'User is not registered.') {
            this.openNotRegisteredModal();
          } else {
            this.snackbar.showMessage(
              'Failed to submit book request: ' + response.message
            );
          }
        }
      },
      error => {
        if (this.snackbar) {
          this.snackbar.showMessage('Error submitting book request.');
        }
        console.error('Error:', error);
      }
    );
  }
}
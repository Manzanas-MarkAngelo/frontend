import { Component, ViewChild, OnInit } from '@angular/core';
import { AddMaterialService } from '../../../services/add-material.service';
import { MaterialsService } from '../../../services/materials.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { LibrarianService } from '../../../services/librarian.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-materials-add',
  templateUrl: './materials-add.component.html',
  styleUrls: ['./materials-add.component.css']
})
export class MaterialsAddComponent implements OnInit {
  @ViewChild('bookForm') bookForm!: NgForm;
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  bookDetails = {
    title: '',
    heading: 0,
    accnum: '',
    category: '',
    author: '',
    callnum: '',
    copyright: '',
    publisher: '',
    edition: '',
    isbn: '',
    status: 'Available'
  };

  resetForm(): void {
    this.bookDetails = {
      title: '',
      heading: 0,
      accnum: '',
      category: '',
      author: '',
      callnum: '',
      copyright: '',
      publisher: '',
      edition: '',
      isbn: '',
      status: 'Available'
    };
  
    this.selectedCategory = { cat_id: 0, mat_type: 'Select Category' };
    this.selectedSubject = { id: 0, subject_name: 'Select Subject Heading' };
  
    if (this.bookForm) {
      this.bookForm.resetForm();
    }
  }  

  material: any = {};
  showModal = false;
  showModalDelete = false;
  isDropdownOpen = false;
  selectedCategory: { cat_id: number, mat_type: string } | null = null;
  categories: { cat_id: number, mat_type: string }[] = [];
  showTooltip = false;
  continueButtonClicked = false;
  
  isSubjectDropdownOpen = false;
  selectedSubject: { id: number, subject_name: string } | null = null;
  subjects: { id: number, subject_name: string }[] = [];
  dropdownSubjects: { id: number, subject_name: string }[] = [];  
  filteredSubjects: { id: number, subject_name: string }[] = [];
  subjectSearchTerm: string = '';
  subject_id: number;
  newSubjectName: string = '';
  snackBarVisible: boolean = true;
  snackBarMessage: string = '';

  currentPage: number = 1;
  totalPages: number = 1;
  totalSubjects: number = 0;
  isSubmitting: boolean = false;
  subjectSearchSubject: Subject<string> = new Subject();
  subjectToDelete: any = null; 

  constructor(
    private addMaterialService: AddMaterialService, 
    private router: Router, 
    private location: Location,
    private materialsService: MaterialsService,
    private librarianService: LibrarianService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.fetchSubjects();
    this.fetchSubjectsPaginated();

    
    this.subjectSearchSubject.pipe(
      debounceTime(300),  
      switchMap(term => this.addMaterialService
          .getPaginatedSubjects(this.currentPage, term)) 
    ).subscribe(data => {
      this.subjects = data.subjects;
      this.totalPages = data.pagination.totalPages;
      this.totalSubjects = data.pagination.totalSubjects;
    });
  }

  onSubjectSearch(term: string): void {
    this.fetchSubjects(term);
  }

  editSubject(subjectId: number): void {
    this.router.navigate(['/edit-subject', subjectId]);
  }

  loadCategories(): void {
    this.materialsService.getCategories().subscribe(data => {
      this.categories = data.map((category: any) => ({
        cat_id: category.cat_id,
        mat_type: category.mat_type
      }));
      this.selectedCategory = { cat_id: 0, mat_type: 'Select Category' };
    });
  }

  fetchSubjects(searchTerm: string = ''): void {
    this.addMaterialService.getSubjectHeadings(searchTerm).subscribe(data => {
      this.dropdownSubjects = data.map((subject: any) => ({
        id: subject.id,
        subject_name: subject.subject_name
      }));
      this.filteredSubjects = [...this.dropdownSubjects]; 
    });
  }

  fetchSubjectsPaginated(searchTerm: string = ''): void {
    this.addMaterialService.getPaginatedSubjects(this.currentPage, searchTerm).subscribe(data => {
      this.subjects = data.subjects;
      this.totalPages = data.pagination.totalPages;
      this.totalSubjects = data.pagination.totalSubjects;
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchSubjectsPaginated(this.subjectSearchTerm);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchSubjectsPaginated(this.subjectSearchTerm);
    }
  }

  addSubject(): void {
    if (!this.newSubjectName.trim()) {
      return;
    }
    this.librarianService.addSubject(this.newSubjectName).subscribe({
      next: (response) => {
        this.snackbar.showMessage(response.success ? 'Subject added successfully' : 'Failed to add Subject');
        if (response.success) this.fetchSubjectsPaginated();
        this.newSubjectName = '';
      },
      error: () => this.snackbar.showMessage('Failed to add Subject')
    });
  }

 
  deleteSubject(subjectId: number): void {
  
    this.addMaterialService.getSubjectById(subjectId).subscribe({
      next: (response) => {
        if (response && response.id) {
          this.subjectToDelete = response; 
          this.showModalDelete = true;  
        } else {
          this.snackbar.showMessage('Subject not found.');
        }
      },
      error: () => {
        this.snackbar.showMessage('Failed to fetch subject details.');
      }
    });
  }

  closeConfirmModal(): void {
    this.showModalDelete = false;
    this.showModal = false;
    this.subjectToDelete = null;  
  }

  confirmDeleteSubject(): void {
    if (this.subjectToDelete && this.subjectToDelete.id) {
      this.addMaterialService.deleteSubject(this.subjectToDelete.id).subscribe({
        next: (response) => {
          this.snackbar.showMessage(response.success ? 'Subject deleted successfully' : 'Failed to delete subject');
          if (response.success) {
            this.fetchSubjectsPaginated();  
          }
          this.closeConfirmModal();  
        },
        error: () => {
          this.snackbar.showMessage('Failed to delete subject');
          this.closeConfirmModal();  
        }
      });
    }
  }

  openConfirmModal(): void {
    this.continueButtonClicked = true;
    ['title', 'category', 'author', 'heading', 'copyright', 'callnum', 'edition', 'publisher', 'isbn']
      .forEach(controlName => this.bookForm.controls[controlName]?.markAsTouched());
  
    if (this.bookDetails.heading === 0) {
      this.bookForm.controls['heading'].setErrors({ required: true });
    }
  
    if (this.bookForm.valid && !this.bookForm.controls['category'].invalid) {
      this.showModal = true;
      this.continueButtonClicked = false;
    }
  }  

  saveBook(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.addMaterialService.addBook(this.bookDetails).subscribe({
      next: () => {
        this.closeConfirmModal();
        this.snackbar.showMessage('Material added successfully');
        this.resetForm();
      },
      error: () => {
        this.snackbar.showMessage('Error adding material');
        this.isSubmitting = false;
      },
      complete: () => this.isSubmitting = false
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(cat_id: number, mat_type: string): void {
    this.bookDetails.category = cat_id.toString();
    this.selectedCategory = { cat_id, mat_type };
    this.isDropdownOpen = false;
    this.addMaterialService.getAccessionNumber(cat_id).subscribe(response => {
      this.bookDetails.accnum = response.response;
    });
  }

  toggleSubjectDropdown(): void {
    this.isSubjectDropdownOpen = !this.isSubjectDropdownOpen;
  }

  selectSubjectHeading(id: number, subject_name: string): void {
    this.subject_id = id;
    this.bookDetails.heading = id;
    this.selectedSubject = { id, subject_name };
    this.isSubjectDropdownOpen = false;
  }

  goBack(): void {
    this.location.back();
  }
}
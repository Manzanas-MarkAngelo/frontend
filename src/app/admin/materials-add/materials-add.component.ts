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

  material: any = {};
  showModal = false;
  isDropdownOpen = false;
  selectedCategory: { cat_id: number, mat_type: string } | null = null;
  categories: { cat_id: number, mat_type: string }[] = [];
  showTooltip = false;
  continueButtonClicked = false;
  
  isSubjectDropdownOpen = false;
  selectedSubject: { id: number, subject_name: string } | null = null;
  subjects: { id: number, subject_name: string }[] = [];  // For the table
  dropdownSubjects: { id: number, subject_name: string }[] = [];  // For the dropdown
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
  subjectSearchSubject: Subject<string> = new Subject();  // New subject for search term

  constructor(
    private addMaterialService: AddMaterialService, 
    private router: Router, 
    private location: Location,
    private materialsService: MaterialsService,
    private librarianService: LibrarianService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.fetchSubjects();  // Fetch initial subjects for the dropdown
    this.fetchSubjectsPaginated();  // Fetch paginated subjects for the table

    // Subscribe to the subject search term with debounce for the dropdown
    this.subjectSearchSubject.pipe(
      debounceTime(300),  // Wait for 300ms after user stops typing
      switchMap(term => this.addMaterialService.getPaginatedSubjects(this.currentPage, term))  // Fetch paginated subjects
    ).subscribe(data => {
      this.subjects = data.subjects;
      this.totalPages = data.pagination.totalPages;
      this.totalSubjects = data.pagination.totalSubjects;
    });
  }

  // Update the search term and trigger the debounce logic
  onSubjectSearch(term: string): void {
    this.subjectSearchSubject.next(term);  // Emit the search term to trigger debounced fetch
    this.filteredSubjects = this.dropdownSubjects.filter(subject => subject.subject_name.toLowerCase().includes(term.toLowerCase()));
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

  // Fetch subjects for the dropdown, not paginated
  fetchSubjects(searchTerm: string = ''): void {
    this.addMaterialService.getSubjectHeadings(searchTerm).subscribe(data => {
      this.dropdownSubjects = data.map((subject: any) => ({
        id: subject.id,
        subject_name: subject.subject_name
      }));
      this.filteredSubjects = [...this.dropdownSubjects];  // Initial filter for the dropdown
    });
  }

  // Fetch paginated subjects for the table
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
      console.log('Subject name is required');
      return;
    }
    this.librarianService.addSubject(this.newSubjectName).subscribe({
      next: (response) => {
        this.snackbar.showMessage(response.success ? 'Subject added successfully' : 'Failed to add Subject');
        if (response.success) this.fetchSubjectsPaginated();  // Re-fetch paginated subjects
        this.newSubjectName = '';
      },
      error: () => this.snackbar.showMessage('Failed to add Subject')
    });
  }

  deleteSubject(subjectId: number): void {
    if (confirm('Are you sure you want to delete this subject?')) {
      this.addMaterialService.deleteSubject(subjectId).subscribe({
        next: (response) => {
          this.snackbar.showMessage(response.success ? 'Subject deleted successfully' : 'Failed to delete subject');
          if (response.success) this.fetchSubjectsPaginated();  // Re-fetch paginated subjects after delete
        },
        error: () => this.snackbar.showMessage('Failed to delete subject')
      });
    }
  }

  openConfirmModal(): void {
    this.continueButtonClicked = true;
    ['title', 'category', 'author', 'heading', 'copyright', 'callnum', 'edition', 'publisher', 'isbn']
      .forEach(controlName => this.bookForm.controls[controlName]?.markAsTouched());

    if (this.bookForm.valid && !this.bookForm.controls['category'].invalid) {
      this.showModal = true;
      this.continueButtonClicked = false;
    }
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveBook(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.addMaterialService.addBook(this.bookDetails).subscribe({
      next: () => {
        this.closeConfirmModal();
        this.router.navigate(['/add-success']);
      },
      error: () => {
        console.error('Error adding material');
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

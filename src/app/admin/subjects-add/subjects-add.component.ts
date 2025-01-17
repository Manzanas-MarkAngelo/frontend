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
  selector: 'app-subjects-add',
  templateUrl: './subjects-add.component.html',
  styleUrl: './subjects-add.component.css'
})
export class SubjectsAddComponent {
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
  showModalAddSubject: boolean = false;

  constructor(
    private addMaterialService: AddMaterialService, 
    private router: Router, 
    private location: Location,
    private materialsService: MaterialsService,
    private librarianService: LibrarianService,
  ) {}

  ngOnInit(): void {
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

  cancelAddSubject(): void {
    this.goBack();
    this.newSubjectName = '';
    this.selectedSubject = null;
  }
  
  onSubjectSearch(term: string): void {
    this.fetchSubjects(term);
  }

  editSubject(subjectId: number): void {
    this.router.navigate(['/edit-subject', subjectId]);
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
    if (this.isFormValid()) {
      this.librarianService.addSubject(this.newSubjectName).subscribe({
        next: (response) => {
          this.snackbar.showMessage(response.success ? 'Subject added successfully' : 'Failed to add Subject');
          if (response.success) {
            this.fetchSubjectsPaginated();
          }
          this.newSubjectName = '';
          this.closeConfirmModalAddSubject();
        },
        error: () => {
          this.snackbar.showMessage('Failed to add Subject');
          this.closeConfirmModalAddSubject();
        }
      });
    }
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

  isFormValid(): boolean {
    return this.newSubjectName.trim().length > 0;
  }

  openConfirmModalAddSubject(): void {
    if (this.isFormValid()) {
      this.showModalAddSubject = true;
    }
  }

  closeConfirmModalAddSubject(): void {
    this.showModalAddSubject = false;
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

  goBack(): void {
    this.location.back();
  }
}
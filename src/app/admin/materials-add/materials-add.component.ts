import { Component, ViewChild } from '@angular/core';
import { AddMaterialService } from '../../../services/add-material.service';
import { MaterialsService } from '../../../services/materials.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-materials-add',
  templateUrl: './materials-add.component.html',
  styleUrls: ['./materials-add.component.css']
})
export class MaterialsAddComponent {
  @ViewChild('bookForm') bookForm!: NgForm;  // Reference to the form

  bookDetails = {
    title: '',
    heading: '',
    accnum: '',  // This will be updated with the last number for accession number
    category: '',
    author: '',
    callnum: '',
    copyright: '',
    publisher: '',
    edition: '',
    isbn: '',
    status: 'Available' // Default value
  };

  constructor(
    private addMaterialService: AddMaterialService, 
    private router: Router, 
    private location: Location,
    private materialsService: MaterialsService
  ) {}

  material: any = {};
  showModal = false; 
  isDropdownOpen = false; 
  selectedCategory: { cat_id: number, mat_type: string } | null = null;  // To display mat_type in dropdown
  categories: { cat_id: number, mat_type: string }[] = [];  // Holds cat_id and mat_type
  showTooltip = false;
  continueButtonClicked = false;

  isSubjectDropdownOpen = false; 
  selectedSubject: { id: number, subject_name: string } | null = null;  // To display subject heading in dropdown
  subjects: { id: number, subject_name: string }[] = [];  // Holds subject ids and headings


  ngOnInit(): void {
    // Fetch categories from the database
    this.materialsService.getCategories().subscribe(data => {
      this.categories = data.map((category: any) => ({
        cat_id: category.cat_id,
        mat_type: category.mat_type
      }));

      // Set a default selected category if necessary
      this.selectedCategory = { cat_id: 0, mat_type: 'Select Category' };
    });

        // Fetch subject headings from the database
        this.addMaterialService.getSubjectHeadings().subscribe(data => {
          this.subjects = data.map((subject: any) => ({
            id: subject.id,
            subject_name: subject.subject_name
          }));
    
          this.selectedSubject = { id: 0, subject_name: 'Select Subject' };
        });
  }

  openConfirmModal() {
    this.continueButtonClicked = true;
  
    // List of form control names to validate
    const controlsToValidate = [
      'title', 'category', 'author', 'heading', 'copyright', 
      'callnum', 'edition', 'publisher', 'isbn'
    ];
  
    // Mark each control as touched if it's invalid
    controlsToValidate.forEach(controlName => {
      const control = this.bookForm.controls[controlName];
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  
    // Check if form is valid and category is not invalid
    if (this.bookForm.valid && !this.bookForm.controls['category'].invalid) {
      this.showModal = true;
      console.log('Modal opened');
      this.continueButtonClicked = false;
    }
  }
  

  goBack(): void {
    this.location.back();
  }

  closeConfirmModal() {
    this.showModal = false;
    console.log('Modal closed');
  }

  isSubmitting: boolean = false;  // Flag to prevent multiple submissions

  saveBook() {
    if (this.isSubmitting) {
      return;  // Exit early if a submission is in progress
    }
  
    this.isSubmitting = true;  // Set flag to true once submission starts
  
    console.log(this.bookDetails);  // Check if category is correctly set
  
    this.addMaterialService.addBook(this.bookDetails).subscribe({
      next: (response) => {
        console.log(response);
        this.closeConfirmModal();
        // Handle success
        this.router.navigate(['/add-success']);
      },
      error: (error) => {
        console.error('Error adding material:', error);
        // Optionally reset the flag on error
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;  // Reset the flag once the submission completes
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(cat_id: number, mat_type: string): void {
    this.bookDetails.category = cat_id.toString();  // Set the category ID in bookDetails
    this.selectedCategory = { cat_id, mat_type };  // Display selected mat_type in dropdown
    this.isDropdownOpen = false;

    // Send the selected category ID to the backend and get the accession number
    this.addMaterialService.getAccessionNumber(cat_id).subscribe(response => {
      this.bookDetails.accnum = response.response;  // Update accnum with the response from the backend
      console.log(`ACCNUM: ${this.bookDetails.accnum}`);
    });
  }

  toggleSubjectDropdown() {
    this.isSubjectDropdownOpen = !this.isSubjectDropdownOpen;
  }

  selectSubjectHeading(id: number, subject_name: string): void {
    this.bookDetails.heading = subject_name;  // Set the subject heading in bookDetails
    this.selectedSubject = { id, subject_name };  // Display selected heading in dropdown
    this.isSubjectDropdownOpen = false;
  }
}

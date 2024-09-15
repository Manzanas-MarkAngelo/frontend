import { Component } from '@angular/core';
import { AddMaterialService } from '../../../services/add-material.service';
import { MaterialsService } from '../../../services/materials.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-materials-add',
  templateUrl: './materials-add.component.html',
  styleUrls: ['./materials-add.component.css']
})
export class MaterialsAddComponent {
  bookDetails = {
    title: '',
    heading: '',
    accnum: '',  // This will be updated with the backend response
    category: '',
    author: '',
    callnum: '',
    copyright: '',
    publisher: '',
    edition: '',
    isbn: '',
    status: ''
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
  }

  openConfirmModal() {
    this.showModal = true;
    console.log('Modal opened');
  }

  goBack(): void {
    this.location.back();
  }

  closeConfirmModal() {
    this.showModal = false;
    console.log('Modal closed');
  }

  saveBook() {
    console.log(this.bookDetails);  // Check if category is correctly set
    this.addMaterialService.addBook(this.bookDetails).subscribe(response => {
      console.log(response);
      this.closeConfirmModal();
      // Handle success
      this.router.navigate(['/add-success']);
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Updated selectCategory to fetch accession number based on the selected category
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
}

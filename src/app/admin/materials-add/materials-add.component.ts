import { Component } from '@angular/core';
import { AddMaterialService } from '../../../services/add-material.service';
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
    accnum: '',
    category: '',
    author: '',
    callnum: '',
    copyright: '',
    publisher: '',
    edition: '',
    isbn: '',
    status: ''
  };

  showModal = false; 
  isDropdownOpen = false; 
  selectedCategory: string | null = null;
  categories = [
    'Filipiñana',
    'Circulation',
    'Fiction',
    'Reference',
    'Thesis/Dissertations',
    'Feasibility',
    'Donations',
    'E-Book',
    'PDF',
    'Business Plan',
    'Case Study',
    'Training Manual',
    'OJT/Internship'
  ];

  constructor(private addMaterialService: AddMaterialService, 
              private router: Router, 
              private location: Location) {}

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

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.bookDetails.category = category;
    this.isDropdownOpen = false;
  }
}

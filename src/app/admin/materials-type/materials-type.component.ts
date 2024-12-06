import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MaterialsService } from '../../../services/materials.service';
import { Router } from '@angular/router';
import { AddMaterialService } from '../../../services/add-material.service';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'app-materials-type',
  templateUrl: './materials-type.component.html',
  styleUrls: ['./materials-type.component.css']
})
export class MaterialsTypeComponent implements OnInit {
  categories: any[] = [];
  totalCount: number = 0;
  snackBarVisible: boolean = false;
  snackBarMessage: string = '';
  showModal: boolean = false;
  selectedCategoryId: string = '';
  selectedMaterialTitle: string = '';

  currentPage: number = 1;
  limit: number = 7;
  totalCategories: number = 0;
  totalMaterials = 0;
  totalPages: number = 0;

  classname: string = '';
  type: boolean = false;
  accnum: string = '';
  duration: number = 0;
  isSubmitting: boolean = false;
  analyticsData: any = {}


  constructor(private location: Location, 
              private materialsService: MaterialsService, 
              private router: Router,
              private addMaterialService: AddMaterialService,
              private analyticsService: AnalyticsService, 
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.loadAnalytics();
  }

  getCategories(): void {
    this.materialsService.getPaginatedCategories(this.currentPage, this.limit).subscribe(
      data => {
        this.categories = data.categories;
        this.totalCategories = parseInt(data.total_categories, 10);
        this.totalMaterials = parseInt(data.total_materials, 10);
        this.totalPages = Math.ceil(this.totalCategories / this.limit);
        this.calculateTotalCount();
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  loadAnalytics() {
    this.analyticsService.getAnalyticsData().subscribe(
      (data) => {
        this.analyticsData = data;
      },
      (error) => {
        console.error('Error fetching analytics data', error)
      }
    );
  }

  addMaterialType(): void {
    if (this.isSubmitting) {
      return;
    }
  
    this.isSubmitting = true;
    const categoryDetails = {
      mat_type: this.classname,
      cat_type: this.type ? 'Special case' : 'Normal',
      accession_no: this.accnum,
      duration: this.duration || null,
    };
  
    this.addMaterialService.addCategory(categoryDetails).subscribe(
      response => {
        this.isSubmitting = false;
        this.snackBarMessage = 'Material type added successfully!';
        this.snackBarVisible = true;
        this.getCategories(); // Refresh the categories list
      },
      error => {
        console.error('Error adding material type', error);
        this.isSubmitting = false;
        this.snackBarMessage = 'Failed to add material type. Please try again.';
        this.snackBarVisible = true;
      }
    );
  }
  

  calculateTotalCount(): void {
    this.totalCount = this.categories.reduce((total, material) => {
      const counterValue = parseInt(material.counter || '0', 10);
      return total + counterValue;
    }, 0);
  }

  goBack(): void {
    this.location.back();
  }

  editCategory(cat_id: string): void {
    this.router.navigate(['/edit-type', cat_id]);
  }

  showConfirmModal(cat_id: string, mat_type: string): void {
    this.selectedCategoryId = cat_id;
    this.selectedMaterialTitle = mat_type;
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  deleteCategory(): void {
    this.materialsService.deleteCategory(this.selectedCategoryId).subscribe(
      response => {
        if (response.error) {
          this.snackBarMessage = response.error;
          this.snackBarVisible = true;
        } else {
          this.snackBarMessage = response.success;
          this.snackBarVisible = true;
          this.getCategories();
        }
        this.closeConfirmModal();
      },
      error => {
        console.error('Error deleting category', error);
        this.snackBarMessage = 'Cannot delete, there are materials using this category';
        this.snackBarVisible = true;
        this.closeConfirmModal();
      }
    );
  }

  closeSnackBar(): void {
    this.snackBarVisible = false;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getCategories();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getCategories();
    }
  }
}
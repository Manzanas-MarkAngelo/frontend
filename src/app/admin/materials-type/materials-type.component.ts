import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MaterialsService } from '../../../services/materials.service';
import { Router } from '@angular/router';

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

  constructor(private location: Location, private materialsService: MaterialsService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.materialsService.getCategories().subscribe(
      data => {
        this.categories = data;
        this.calculateTotalCount();
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  calculateTotalCount(): void {
    this.totalCount = this.categories.reduce((total, category) => {
      const counterValue = parseInt(category.counter || '0', 10);
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
          this.getCategories(); // Refresh the categories list
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
}

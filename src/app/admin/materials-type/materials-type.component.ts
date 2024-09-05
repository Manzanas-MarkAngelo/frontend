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
  //TODO implement delete material type
  showConfirmModal(cat_id: string, mat_type: string): void {

    if (confirm(`Are you sure you want to delete the material type: ${mat_type}?`)) {

      console.log('Delete category with cat_id:', cat_id);
    }
  }
}

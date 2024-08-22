import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MaterialsService } from '../../../services/materials.service';

@Component({
  selector: 'app-materials-type',
  templateUrl: './materials-type.component.html',
  styleUrls: ['./materials-type.component.css']
})
export class MaterialsTypeComponent implements OnInit {
  categories: any[] = [];
  totalCount: number = 0;

  constructor(private location: Location, private materialsService: MaterialsService) {}

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
      // Ensure the counter value is a number
      const counterValue = parseInt(category.counter || '0', 10);
      return total + counterValue;
    }, 0);
  }

  goBack(): void {
    this.location.back();
  }
}

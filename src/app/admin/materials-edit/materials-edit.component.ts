import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.css']
})
export class MaterialsEditComponent implements OnInit {
  material: any = {};
  categories: { cat_id: number, mat_type: string }[] = []; // Holds cat_id and mat_type
  selectedCategory: { cat_id: number, mat_type: string } | null = null; // To display mat_type in dropdown
  isDropdownOpen: boolean = false;
  showModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private materialsService: MaterialsService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Fetch categories from the database
    this.materialsService.getCategories().subscribe(data => {
      this.categories = data.map((category: any) => ({
        cat_id: category.cat_id,
        mat_type: category.mat_type
      }));

      const accnum = this.route.snapshot.paramMap.get('accnum');
      if (accnum) {
        this.materialsService.getMaterialDetails(accnum).subscribe(data => {
          this.material = data;
          this.populateForm();
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  populateForm(): void {
    this.material.title = this.material.title || 'unknown/empty';
    this.material.subj = this.material.subj || 'unknown/empty';
    this.material.accnum = this.material.accnum || 'unknown/empty';
    this.material.category = this.material.categoryid || 0; // Default to 0 if no category
    this.material.author = this.material.author || 'unknown/empty';
    this.material.callno = this.material.callno || 'unknown/empty';
    this.material.copyright = this.material.copyright || 'unknown/empty';
    this.material.publisher = this.material.publisher || 'unknown/empty';
    this.material.edition = this.material.edition || 'unknown/empty';
    this.material.isbn = this.material.isbn || 'unknown/empty';
    this.material.status = this.material.status || 'unknown/empty';

    // Find the selected category based on category ID
    const selectedCategory = this.categories.find(c => c.cat_id === this.material.category);
    if (selectedCategory) {
      this.selectedCategory = selectedCategory; // Set the selected category for display
    } else {
      this.selectedCategory = { cat_id: 0, mat_type: 'Select Category' }; // Default display if none found
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(cat_id: number, mat_type: string): void {
    this.material.category = cat_id;  // Set the category ID in material
    this.selectedCategory = { cat_id, mat_type };  // Display selected mat_type in dropdown
    this.isDropdownOpen = false;
  }

  showConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveChanges(): void {
    this.materialsService.updateMaterial(this.material).subscribe(
      response => {
        if (response.status === 'success') {
          console.log('Update successful');
          this.router.navigate(['/materials-success']);
        } else {
          console.log('Update failed', response.message);
        }
        this.showModal = false;
      },
      error => {
        console.error('Request failed', error);
        this.showModal = false;
      }
    );
  }
}

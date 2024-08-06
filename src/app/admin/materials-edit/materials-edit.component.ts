import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.css']
})
export class MaterialsEditComponent implements OnInit {
  material: any = {};
  categories: string[] = ['Filipiñana', 'Circulation', 'Fiction', 'Reference', 'Thesis/Dissertations', 'Feasibility', 'Donations', 'E-Book', 'PDF', 'Business Plan', 'Case Study', 'Training Manual', 'OJT/Internship'];
  selectedCategory: string | null = null;
  isDropdownOpen: boolean = false;
  showModal: boolean = false;

  constructor(private route: ActivatedRoute, 
              private materialsService: MaterialsService, 
              private router: Router,
              private location: Location) {}

  ngOnInit(): void {
    const accnum = this.route.snapshot.paramMap.get('accnum');
    if (accnum) {
      this.materialsService.getMaterialDetails(accnum).subscribe(data => {
        this.material = data;
        this.populateForm();
        this.selectCategory(this.categoryIdMap[this.material.categoryid]);
        console.log(this.categoryIdMap[this.material.category] || 'Select Category');
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  private categoryIdMap: { [key: number]: string } = {
    20: 'Filipiñana',
    21: 'Circulation',
    22: 'Fiction',
    23: 'Reference',
    26: 'Thesis/Dissertations',
    27: 'Feasibility',
    28: 'Donations',
    29: 'E-Book',
    30: 'PDF',
    31: 'Business Plan',
    32: 'Case Study',
    33: 'Training Manual'
  };
  
  //TODO: integrate with category table once db is finalized (get categories from the table)
  populateForm(): void {
    this.material.title = this.material.title || 'unknown/empty';
    this.material.subj = this.material.subj || 'unknown/empty';
    this.material.accnum = this.material.accnum || 'unknown/empty';
    this.material.category = this.material.categoryid || 0;  // Default to 0 if no category
    this.material.author = this.material.author || 'unknown/empty';
    this.material.callno = this.material.callno || 'unknown/empty';
    this.material.copyright = this.material.copyright || 'unknown/empty';
    this.material.publisher = this.material.publisher || 'unknown/empty';
    this.material.edition = this.material.edition || 'unknown/empty';
    this.material.isbn = this.material.isbn || 'unknown/empty';
    this.material.status = this.material.status || 'unknown/empty';
  
    // Set selectedCategory based on category ID
    this.selectedCategory = this.categoryIdMap[this.material.categoryid] 
        || 'Select Category';
  }
  

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(category: string): void {
    this.material.category = category;
    this.selectedCategory = category;
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
          this.router.navigate(['/materials-success'])
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

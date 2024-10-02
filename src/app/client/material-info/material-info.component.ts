import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-material-info',
  templateUrl: './material-info.component.html',
  styleUrl: './material-info.component.css'
})
export class MaterialInfoComponent {
  material: any = {};
  categories: { cat_id: number, mat_type: string }[] = [];

  constructor(private route: ActivatedRoute, 
              private materialsService: MaterialsService, 
              private location: Location) {}

  ngOnInit(): void {
    const accnum = this.route.snapshot.paramMap.get('accnum');
    if (accnum) {
      // Fetch material details
      this.materialsService.getMaterialDetails(accnum).subscribe(data => {
        this.material = data;
        this.populateForm();
      });

      // Fetch categories (assuming you have a method to fetch categories)
      this.materialsService.getCategories().subscribe(cats => {
        this.categories = cats;
      });
    }
  }

  simulateBackButton(): void {
    this.location.back();
  }

  populateForm(): void {
    console.log('CAT ID:', this.material.categoryid);

    // Populate form fields with material data
    this.material.title = this.material.title || 'unknown/empty';
    this.material.subj = this.material.subj || 'unknown/empty';
    this.material.accnum = this.material.accnum || 'unknown/empty';
    this.material.author = this.material.author || 'unknown/empty';
    this.material.callno = this.material.callno || 'unknown/empty';
    this.material.copyright = this.material.copyright || 'unknown/empty';
    this.material.publisher = this.material.publisher || 'unknown/empty';
    this.material.edition = this.material.edition || 'unknown/empty';
    this.material.isbn = this.material.isbn || 'unknown/empty';
    this.material.status = this.material.status || 'unknown/empty';

    // Find the matching category by categoryid and assign the mat_type
    const matchingCategory = this.categories.find(cat => cat.cat_id === this.material.categoryid);
    if (matchingCategory) {
      this.material.category = matchingCategory.mat_type;
    } else {
      this.material.category = 'unknown/empty'; 
    }
  }
}

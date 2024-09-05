import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';

@Component({
  selector: 'app-edit-type',
  templateUrl: './edit-type.component.html',
  styleUrls: ['./edit-type.component.css']
})
export class EditTypeComponent implements OnInit {
  classname: string;
  type: boolean;
  accnum: string;
  duration: number;
  isSubmitting = false;
  cat_id: string; // To store the cat_id

  constructor(
    private materialService: MaterialsService, 
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit() {
    // Extract cat_id from URL
    this.cat_id = this.route.snapshot.paramMap.get('cat_id');
    
    // Fetch the data for this category ID
    this.getCategoryDetails(this.cat_id);
  }

  getCategoryDetails(cat_id: string) {
    this.materialService.getCategory(cat_id).subscribe(
      (category) => {
        // Bind the fetched data to the form fields
        this.classname = category.mat_type;
        this.type = category.cat_type === 'Special case';
        this.accnum = category.accession_no;
        this.duration = category.duration;
      },
      (error) => {
        console.error('Error fetching category details', error);
      }
    );
  }

  onTypeChange(event: any) {
    this.type = event;
  }

  updateMaterialType() {
    if (this.isSubmitting) {
      console.log('Submission already in progress');
      return;
    }

    this.isSubmitting = true;
    const categoryDetails = {
      mat_type: this.classname,
      cat_type: this.type ? 'Special case' : 'Normal',
      accession_no: this.accnum,
      duration: this.duration || null, // Set to null if not provided
    };

    console.log('Payload to be sent:', categoryDetails);

    this.materialService.updateCategory(this.cat_id, categoryDetails).subscribe(
      response => {
        console.log('Category updated successfully', response);
        this.isSubmitting = false;
        this.router.navigate(['/materials-success']);
      },
      error => {
        console.error('Error updating category', error);
        this.isSubmitting = false;
      }
    );
  }
}

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
  cat_id: string;

  constructor(
    private materialService: MaterialsService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cat_id = this.route.snapshot.paramMap.get('cat_id');
    
    this.getCategoryDetails(this.cat_id);
  }

  getCategoryDetails(cat_id: string) {
    this.materialService.getCategory(cat_id).subscribe(
      (category) => {
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
      return;
    }

    this.isSubmitting = true;
    const categoryDetails = {
      mat_type: this.classname,
      cat_type: this.type ? 'Special case' : 'Normal',
      accession_no: this.accnum,
      duration: this.duration || null,
    };

    this.materialService.updateCategory(this.cat_id, categoryDetails).subscribe(
      response => {
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
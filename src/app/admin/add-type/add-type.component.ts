import { Component } from '@angular/core';
import { AddMaterialService } from '../../../services/add-material.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent {
  classname: string;
  type: boolean;
  accnum: string;
  duration: number;
  isSubmitting = false;

  constructor(private addMaterialService: AddMaterialService, 
              private router: Router) {}

  onTypeChange(event: any) {
    this.type = event;
  }

  addMaterialType() {
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

    console.log('Payload to be sent:', categoryDetails); // Log the payload

    this.addMaterialService.addCategory(categoryDetails).subscribe(
      response => {
        console.log('Category added successfully', response);
        this.isSubmitting = false;
        this.router.navigate(['/add-type-success']);
      },
      error => {
        console.error('Error adding category', error);
        this.isSubmitting = false;
      }
    );
  }
}

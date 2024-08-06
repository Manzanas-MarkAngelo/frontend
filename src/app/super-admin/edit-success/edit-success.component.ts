import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edit-success',
  templateUrl: './edit-success.component.html',
  styleUrl: './edit-success.component.css'
})
export class EditSuccessComponent {

  constructor (private location: Location){}

  goBack(): void {
    this.location.back();
    this.location.back();
  }
}
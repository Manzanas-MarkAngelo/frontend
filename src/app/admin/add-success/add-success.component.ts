import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-success',
  templateUrl: './add-success.component.html',
  styleUrl: './add-success.component.css'
})
export class AddSuccessComponent {

  constructor (private location: Location){}

  goBack(): void {
    this.location.back();
    this.location.back();
  }
}

import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-materials-success',
  templateUrl: './materials-success.component.html',
  styleUrl: './materials-success.component.css'
})
export class MaterialsSuccessComponent {

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
    this.location.back();
  }

}

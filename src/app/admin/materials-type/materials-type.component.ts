import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-materials-type',
  templateUrl: './materials-type.component.html',
  styleUrl: './materials-type.component.css'
})
export class MaterialsTypeComponent {

  constructor(private location: Location) {}

  goBack(){
    this.location.back();
  }

}

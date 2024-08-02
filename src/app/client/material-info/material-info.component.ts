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

  constructor(private route: ActivatedRoute, 
              private materialsService: MaterialsService, 
              private location: Location) {}

  ngOnInit(): void {
    const accnum = this.route.snapshot.paramMap.get('accnum');
    if (accnum) {
      this.materialsService.getMaterialDetails(accnum).subscribe(data => {
        this.material = data;
        this.populateForm();
      });
    }
  }

  simulateBackButton(): void {
    this.location.back();
  }

  populateForm(): void {
    // Populate form fields with material data, set default value to "unknown/empty" if field is empty
    this.material.title = this.material.title || 'unknown/empty';
    this.material.subj = this.material.subj || 'unknown/empty';
    this.material.accnum = this.material.accnum || 'unknown/empty';
    this.material.category = this.material.category || 'unknown/empty';
    this.material.author = this.material.author || 'unknown/empty';
    this.material.callno = this.material.callno || 'unknown/empty';
    this.material.copyright = this.material.copyright || 'unknown/empty';
    this.material.publisher = this.material.publisher || 'unknown/empty';
    this.material.edition = this.material.edition || 'unknown/empty';
    this.material.isbn = this.material.isbn || 'unknown/empty';
    this.material.status = this.material.status || 'unknown/empty';
  }
}


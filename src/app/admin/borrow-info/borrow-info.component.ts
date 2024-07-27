import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';

@Component({
  selector: 'app-borrow-info',
  templateUrl: './borrow-info.component.html',
  styleUrls: ['./borrow-info.component.css']
})
export class BorrowInfoComponent implements OnInit {
  material: any = {};

  constructor(private route: ActivatedRoute, private materialsService: MaterialsService) {}

  ngOnInit(): void {
    const accnum = this.route.snapshot.paramMap.get('accnum');
    if (accnum) {
      this.materialsService.getMaterialDetails(accnum).subscribe(data => {
        this.material = data;
        this.populateForm();
      });
    }
  }

  populateForm(): void {
    // Populate form fields with material data, set default value to "null" if field is empty
    this.material.title = this.material.title || 'null';
    this.material.subj = this.material.subj || 'null';
    this.material.accnum = this.material.accnum || 'null';
    this.material.category = this.material.category || 'null';
    this.material.author = this.material.author || 'null';
    this.material.callno = this.material.callno || 'null';
    this.material.copyright = this.material.copyright || 'null';
    this.material.publisher = this.material.publisher || 'null';
    this.material.edition = this.material.edition || 'null';
    this.material.isbn = this.material.isbn || 'null';
    this.material.status = this.material.status || 'null';
  }
}

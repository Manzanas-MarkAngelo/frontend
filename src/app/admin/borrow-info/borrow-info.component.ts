import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';
import { BorrowService } from '../../../services/borrow.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-borrow-info',
  templateUrl: './borrow-info.component.html',
  styleUrls: ['./borrow-info.component.css']
})
export class BorrowInfoComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  material: any = {};
  idNumber: string = '';

  constructor(
    private route: ActivatedRoute, 
    private materialsService: MaterialsService,
    private borrowService: BorrowService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const accnum = this.route.snapshot.paramMap.get('accnum');
    if (accnum) {
      this.materialsService.getMaterialDetails(accnum).subscribe(data => {
        this.material = data;
        this.idNumber = data.borrower_id || '';
        this.populateForm();
      });
    }
  }

  populateForm(): void {
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

  onSubmit(): void {
    if (this.idNumber) {
      this.borrowService.borrowBook(this.idNumber, this.material.id)
        .subscribe(
          response => {
            if (response.status === 'success') {
              this.snackbar.showMessage('Book borrowed successfully!');
              this.router.navigate(['/borrow-success']);
            } else {
              this.snackbar.showMessage('Error borrowing book: ' + response.message);
            }
          },
          error => {
            console.error('Error occurred:', error);
            this.snackbar.showMessage('Failed to borrow book.');
          }
        );
    } else {
      this.snackbar.showMessage('Please fill in the ID number.');
    }
  }
}
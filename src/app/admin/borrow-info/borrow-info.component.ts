import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';
import { BorrowService } from '../../../services/borrow.service';
import { EmailService } from '../../../services/email.service';
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
  isProcessing: boolean = false;
  categories: { cat_id: number, mat_type: string }[] = [];

  constructor(
    private route: ActivatedRoute, 
    private materialsService: MaterialsService,
    private borrowService: BorrowService,
    private emailService: EmailService,
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
      
      // Fetch categories (assuming you have a method to fetch categories)
      this.materialsService.getCategories().subscribe(cats => {
        this.categories = cats;
      });
    }
  }

  populateForm(): void {
    console.log('CAT ID:', this.material.categoryid);
    this.material.title = this.material.title || 'unknown/empty';
    this.material.subj = this.material.subject_name || 'unknown/empty';
    this.material.accnum = this.material.accnum || 'unknown/empty';
    this.material.author = this.material.author || 'unknown/empty';
    this.material.callno = this.material.callno || 'unknown/empty';
    this.material.copyright = this.material.copyright || 'unknown/empty';
    this.material.publisher = this.material.publisher || 'unknown/empty';
    this.material.edition = this.material.edition || 'unknown/empty';
    this.material.isbn = this.material.isbn || 'unknown/empty';
    this.material.status = this.material.status || 'unknown/empty';

    // Find the matching category by categoryid and assign the mat_type
    const matchingCategory = this.categories.find(cat => cat.cat_id === this.material.categoryid);
    if (matchingCategory) {
      this.material.category = matchingCategory.mat_type;
    } else {
      this.material.category = 'Aunknown/empty'; 
    }
  }

  onSubmit(): void {
    if (this.idNumber) {
      this.isProcessing = true;

      this.borrowService.borrowBook(this.idNumber, this.material.id)
        .subscribe(
          response => {
            if (response.status === 'success') {
              this.processEmailNotification();
            } else {
              this.isProcessing = false;
              this.snackbar.showMessage('Error borrowing book: ' + response.message);
            }
          },
          error => {
            this.isProcessing = false; 
            this.snackbar.showMessage('Failed to borrow book.');
          }
        );
    } else {
      this.snackbar.showMessage('Please fill in the ID number.');
    }
  }

  processEmailNotification(): void {
    setTimeout(() => {
      this.emailService.sendBorrowNotification(this.idNumber, this.material.id)
        .subscribe(
          emailResponse => {
            this.isProcessing = false;
            this.snackbar.showMessage('Book borrowed successfully!');

            setTimeout(() => {
              this.router.navigate(['/borrow']);
            }, 1500);
          },
          emailError => {
            this.isProcessing = false;
            this.snackbar.showMessage('Book borrowed but failed to send email.');
          }
        );
    }, 1500);
  }
}
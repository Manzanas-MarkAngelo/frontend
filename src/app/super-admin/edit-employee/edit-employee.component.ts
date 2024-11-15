import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsService } from '../../../services/records.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  employee: any = {};
  showModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    const user_id = this.route.snapshot.paramMap.get('user_id');
    if (user_id) {
      this.recordsService.getRecordById('pupt-employee', user_id).subscribe(data => {
        if (data && !data.error) {
            this.employee = data;
        } else {
            console.error('No record found or error in fetching data', data.error);
        }
      }, error => {
          console.error('Error fetching employee details:', error);
      });       
    }
  }  

  showConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveChanges() {
    this.employee.user_id = this.route.snapshot.paramMap.get('user_id');
    
    this.recordsService.updateEmployee(this.employee).subscribe(response => {
        this.closeConfirmModal();
        this.snackbar.showMessage('Employee details updated successfully!');
        
        setTimeout(() => {
            this.cancelEdit();
        }, 1000);
    }, error => {
        console.error('Error updating employee:', error);
    });
  }

  cancelEdit() {
    this.router.navigate(['/employee']);
  }
}
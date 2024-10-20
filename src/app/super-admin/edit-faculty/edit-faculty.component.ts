import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsService } from '../../../services/records.service';
import { DepartmentService } from '../../../services/department.service';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-edit-faculty',
  templateUrl: './edit-faculty.component.html',
  styleUrls: ['./edit-faculty.component.css']
})
export class EditFacultyComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  faculty: any = {};
  showModal: boolean = false;
  departments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordsService: RecordsService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    const user_id = this.route.snapshot.paramMap.get('user_id');
    if (user_id) {
      this.recordsService.getRecordById('faculty', user_id).subscribe(data => {
        if (data && !data.error) {
          this.faculty = data;
          const department = this.departments.find(dept => dept.dept_abbreviation === this.faculty.department);
          if (department) {
            this.faculty.dept_id = department.id;
          }
        } else {
          console.error('No record found or error in fetching data', data.error);
        }
      }, error => {
        console.error('Error fetching faculty details:', error);
      });
    }
    
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    }, error => {
      console.error('Error fetching departments:', error);
    });
  }  

  showConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveChanges() {
    this.recordsService.updateFaculty(this.faculty).subscribe(() => {
      this.closeConfirmModal();
      this.snackbar.showMessage('Faculty details updated successfully!');
      
      setTimeout(() => {
        this.cancelEdit();
      }, 1000);    }, error => {
      console.error('Error updating faculty:', error);
    });
  }

  cancelEdit() {
    this.router.navigate(['/faculty']);
  }

  getDepartmentName(departmentId: string): string {
    const department = this.departments.find((d) => d.id === departmentId);
    return department ? department.dept_abbreviation : '';
  }
}
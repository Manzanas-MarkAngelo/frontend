import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {
  showModal = false;
  departmentId: number;
  departmentData: any = { dept_program: '', dept_abbreviation: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    this.departmentId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.getDepartmentDetails();
  }

  getDepartmentDetails(): void {
    this.departmentService.getDepartmentById(this.departmentId).subscribe(data => {
      this.departmentData = data;
    });
  }

  openConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveChanges(): void {
    this.departmentService.updateDepartment(this.departmentId, this.departmentData).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/edit-success']);
      } else {
        console.error('Error updating department:', response.message);
      }
    });
  }
}
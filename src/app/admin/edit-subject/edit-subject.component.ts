import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddMaterialService } from '../../../services/add-material.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent implements OnInit, AfterViewInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  subjectName: string = '';
  subjectId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addMaterialService: AddMaterialService
  ) {}

  ngOnInit(): void {
    this.subjectId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchSubject(this.subjectId);
  }

  ngAfterViewInit(): void {
    if (!this.snackbar) {
      console.error('Snackbar component is not initialized.');
    }
  }

  fetchSubject(subjectId: number): void {
    this.addMaterialService.getSubjectById(subjectId).subscribe({
      next: (response) => {
        if (response && response.subject_name) {
          this.subjectName = response.subject_name;
        } else {
          console.error('Subject not found');
        }
      },
      error: () => console.error('Failed to fetch subject data')
    });
  }

  updateSubject(): void {
    this.addMaterialService.updateSubject(this.subjectId, this.subjectName).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackbar?.showMessage('Subject updated successfully');
          setTimeout(() => {
            this.router.navigate(['/subjects-add']);
          }, 1000);
        } else {
          this.snackbar?.showMessage('Failed to update Subject');
        }
      },
      error: () => {
        console.error('Failed to update subject');
        this.snackbar?.showMessage('Error occurred while updating subject');
      }
    });
  }
}
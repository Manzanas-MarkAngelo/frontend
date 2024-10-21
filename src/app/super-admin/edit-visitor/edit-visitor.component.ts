import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsService } from '../../../services/records.service';
import { Location } from '@angular/common';
import { SnackbarComponent } from '../../admin/snackbar/snackbar.component';

@Component({
  selector: 'app-edit-visitor',
  templateUrl: './edit-visitor.component.html',
  styleUrls: ['./edit-visitor.component.css']
})
export class EditVisitorComponent implements OnInit {
  @ViewChild(SnackbarComponent) snackbar!: SnackbarComponent;

  visitor: any = {
    user_id: '',
    school: '',
    gender: '',
    first_name: '',
    surname: '',
    identifier: '',
    phone_number: ''
  };
  showModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recordsService: RecordsService,
    private loaction: Location,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const user_id = params['user_id'];
      this.recordsService.getRecordById('visitor', user_id).subscribe(response => {
        this.visitor = response;
      });
    });
  }

  goBack(): void {
    this.loaction.back();
  }

  showConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveChanges() {
    this.recordsService.updateVisitor(this.visitor).subscribe(response => {
      if (response.status === 'success') {
        this.closeConfirmModal();
        this.snackbar.showMessage('Visitor details updated successfully!');
        
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } else {
        console.error('Update failed:', response.message || response);
      }
    });
  }
}
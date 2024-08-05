import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsService } from '../../../services/records.service';

@Component({
  selector: 'app-edit-visitor',
  templateUrl: './edit-visitor.component.html',
  styleUrls: ['./edit-visitor.component.css']
})
export class EditVisitorComponent implements OnInit {
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
    private recordsService: RecordsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const user_id = params['user_id'];
      this.recordsService.getRecordById('visitor', user_id).subscribe(response => {
        this.visitor = response;
      });
    });
  }

  openModal() {
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
  }

  continueEdit() {
    this.showModal = false;
    this.onSubmit();
  }

  onSubmit() {
    this.recordsService.updateVisitor(this.visitor).subscribe(response => {
      console.log('Response from server:', response);
      if (response.status === 'success') {
        this.router.navigate(['/edit-success']);
      } else {
        // TODO: Handle error here
      }
    });
  }
}
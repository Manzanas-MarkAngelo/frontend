import { Component, OnInit } from '@angular/core';
import { ReturnService } from '../../../services/return.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {
  items: any[] = [];

  constructor(private returnService: ReturnService) {}

  ngOnInit(): void {
    this.fetchBorrowingData();
  }

  fetchBorrowingData(): void {
    this.returnService.getBorrowingData().subscribe(data => {
      this.items = data.map(item => {
        return {
          ...item,
          name: `${item.first_name} ${item.surname}`,
          courseYear: item.course_department,
          remarks: item.remark,
          dueDate: item.due_date,
          dateBorrowed: item.claim_date,
          material_id: item.material_id
        };
      }).sort((a, b) => {
        if (a.remarks === 'Returned' && b.remarks !== 'Returned') {
          return 1;
        } else if (a.remarks !== 'Returned' && b.remarks === 'Returned') {
          return -1;
        } else {
          return new Date(b.dateBorrowed).getTime() - new Date(a.dateBorrowed).getTime();
        }
      });
    });
  }  
}
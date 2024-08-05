import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../../services/records.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.css']
})
export class VisitorComponent implements OnInit {
  searchPlaceholder: string = 'Search visitor';
  logs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 12;
  showModal: boolean = false;
  selectedVisitor: any = null;

  constructor(private recordsService: RecordsService, private router: Router) { }

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords() {
    this.recordsService.getRecords('visitor', this.itemsPerPage, this.currentPage).subscribe(data => {
      this.logs = data.records;
      this.totalPages = data.totalPages;
    }, error => {
      console.error('Error fetching records:', error);
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchRecords();
  }

  openDeleteModal(visitor: any) {
    this.selectedVisitor = visitor;
    this.showModal = true;
  }

  hideModal() {
    this.showModal = false;
    this.selectedVisitor = null;
  }

  deleteVisitor() {
    if (this.selectedVisitor) {
      this.recordsService.deleteVisitor(this.selectedVisitor.user_id).subscribe(() => {
        this.showModal = false;
        this.selectedVisitor = null;
        this.router.navigate(['/delete-visitor-success']);
      }, error => {
        console.error('Error deleting visitor:', error);
      });
    }
  }
}
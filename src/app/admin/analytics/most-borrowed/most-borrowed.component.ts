import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../../../../services/charts.service';

@Component({
  selector: 'app-most-borrowed',
  templateUrl: './most-borrowed.component.html',
  styleUrls: ['./most-borrowed.component.css']
})
export class MostBorrowedComponent implements OnInit {
  mostBorrowedBooks: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private chartsService: ChartsService) { }

  ngOnInit(): void {
    this.fetchMostBorrowedBooks();
  }

  fetchMostBorrowedBooks(): void {
    this.chartsService.getTopTenBorrowedBooks(new Date().getFullYear(), new Date().getMonth() + 1).subscribe(
      (data) => {
        this.mostBorrowedBooks = data.data;
        this.totalPages = Math.ceil(this.mostBorrowedBooks.length / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching most borrowed books:', error);
      }
    );
  }

  get paginatedBooks(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.mostBorrowedBooks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}

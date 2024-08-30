import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environments/local-environment'; // Adjust path if needed


@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private baseUrl = `${environment.apiUrl}/fetch_monthly_users.php`;

  constructor(private http: HttpClient) { }

  //Line chart
  getMonthlyData(year: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?year=${year}&wau=monthly`);
  }

  //Doughnut chart
  getMonthlyBorrowingData(year: number, month: number) {
    return this.http.get<any>(`${environment.apiUrl}/fetch_monthly_borrowing.php?year=${year}&month=${month}`);
  }

  // bar graph
  getTopTenUsers(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/fetch_top_ten_users.php?year=${year}&month=${month}`).pipe(
      catchError(error => {
        console.error('Error fetching top ten users:', error);
        return throwError(() => new Error('Error fetching top ten users'));
      })
    );
  }

  // fetch top 10 most borrowed books
  getTopTenBorrowedBooks(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/fetch_top_ten_borrowed_books.php?year=${year}&month=${month}`).pipe(
      catchError(error => {
        console.error('Error fetching top ten borrowed books:', error);
        return throwError(() => new Error('Error fetching top ten borrowed books'));
      })
    );
  }
}
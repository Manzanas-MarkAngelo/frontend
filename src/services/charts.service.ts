import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private baseUrl = 'http://localhost/controller_lis';

  constructor(private http: HttpClient) { }

  getMonthlyData(year: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetch_monthly_users.php?year=${year}&wau=monthly`);
  }

  getDailyData(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/fetch_monthly_users.php?year=${year}&month=${month}&wau=daily`);
  }
}

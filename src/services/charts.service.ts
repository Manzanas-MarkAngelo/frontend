import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private baseUrl = `${environment.apiUrl}/fetch_monthly_users.php`;

  constructor(private http: HttpClient) { }

  getMonthlyData(year: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?year=${year}&wau=monthly`);
  }
}

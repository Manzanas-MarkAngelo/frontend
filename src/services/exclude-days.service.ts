import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable({
  providedIn: 'root',
})
export class ExcludeDaysService {
  private getExcludedDaysUrl = `${environment.apiUrl}/get_excluded_days.php`;
  private excludeDaysUrl = `${environment.apiUrl}/exclude_days.php`;
  private removeExcludedDateUrl = `${environment.apiUrl}/remove_date_exclusion.php`;

  constructor(private http: HttpClient) {}

  getExcludedDays(): Observable<string[]> {
    return this.http.get<string[]>(this.getExcludedDaysUrl);
  }

  excludeDates(dates: string[]): Observable<any> {
    return this.http.post(this.excludeDaysUrl, { dates });
  }

  removeExcludedDate(date: string): Observable<any> {
    return this.http.delete(`${this.removeExcludedDateUrl}`, { body: { date } });
  }
}
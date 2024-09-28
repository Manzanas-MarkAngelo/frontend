import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class AnalyticsService {
  private analyticsUrl = `${environment.apiUrl}/fetch_analytics_card_details.php`;

  constructor(private http: HttpClient) {}

  getAnalyticsData(): Observable<any> {
    return this.http.get<any>(this.analyticsUrl);
  }
}

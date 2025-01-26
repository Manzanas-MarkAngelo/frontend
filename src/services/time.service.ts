import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private serverTimeUrl = `${environment.apiUrl}/get_server_time.php`; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getServerTime(): Observable<{ currentTime: string }> {
    return this.http.get<{ currentTime: string }>(this.serverTimeUrl);
  }
}

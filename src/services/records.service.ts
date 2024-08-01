import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class RecordsService {
  private logsUrl = `${environment.apiUrl}/get_time_logs.php`;
  private recordsUrl = `${environment.apiUrl}/get_records.php`;

  constructor(private http: HttpClient) { }

  getLogs(logType: string, itemsPerPage: number, page: number): Observable<any> {
    const payload = { logType, itemsPerPage, page };
    return this.http.post<any>(this.logsUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getRecords(recordType: string, itemsPerPage: number, page: number): Observable<any> {
    const payload = { recordType, itemsPerPage, page };
    return this.http.post<any>(this.recordsUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
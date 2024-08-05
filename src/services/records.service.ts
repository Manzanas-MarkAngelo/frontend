import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './environments/local-environment';

@Injectable()
export class RecordsService {
  private logsUrl = `${environment.apiUrl}/get_time_logs.php`;
  private recordsUrl = `${environment.apiUrl}/get_records.php`;
  private updateFacultyUrl = `${environment.apiUrl}/update_faculty.php`;
  private deleteFacultyUrl = `${environment.apiUrl}/delete_faculty.php`;

  constructor(private http: HttpClient) {}

  getLogs(logType: string, itemsPerPage: number, page: number): Observable<any> {
    const payload = { logType, itemsPerPage, page };
    return this.http.post<any>(this.logsUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getRecords(recordType: string, itemsPerPage: number, page: number): Observable<any> {
    const payload = { recordType, itemsPerPage, page };
    return this.http.post<any>(this.recordsUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getRecordById(recordType: string, user_id: string): Observable<any> {
    const payload = { recordType, user_id };
    return this.http.post<any>(this.recordsUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateFaculty(faculty: any): Observable<any> {
    return this.http.post<any>(this.updateFacultyUrl, faculty, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteFaculty(user_id: number): Observable<any> {
    const payload = { user_id };
    return this.http.post<any>(this.deleteFacultyUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getStudentDetails(userId: string): Observable<any> {
    const url = `${environment.apiUrl}/get_records.php`;
    const body = {
      recordType: 'student',
      user_id: userId
    };
    return this.http.post<any>(url, body).pipe(
      catchError(this.handleError)
    );
  }
  
  updateStudent(student: any): Observable<any> {
    const url = `${environment.apiUrl}/update_student_details.php`;
    return this.http.post<any>(url, student, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      map((response: any) => {
        // Handle cases where the response might be a string and needs to be parsed.
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch (e) {
            throw new Error('Invalid JSON response');
          }
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateVisitor(visitor: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/update_visitor.php`, visitor, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // Server-side error occurred.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    if (error.error && typeof error.error === 'string') {
      try {
        const parsedError = JSON.parse(error.error);
        return throwError(() => new Error(parsedError.message || 'An unknown error occurred.'));
      } catch (e) {
        return throwError(() => new Error('Received invalid JSON response from server.'));
      }
    }

    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}

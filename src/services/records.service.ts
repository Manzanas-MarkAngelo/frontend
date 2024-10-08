import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from './environments/local-environment';

@Injectable()
export class RecordsService {
  private logsUrl = `${environment.apiUrl}/get_time_logs.php`;
  private recordsUrl = `${environment.apiUrl}/get_records.php`;
  private updateFacultyUrl = `${environment.apiUrl}/update_faculty.php`;
  private deleteFacultyUrl = `${environment.apiUrl}/delete_faculty.php`;
  private deleteVisitorUrl = `${environment.apiUrl}/delete_visitor.php`;

  constructor(private http: HttpClient) {}

  getLogsReports(logType: string, itemsPerPage: number, page: number, startDate?: string | null, endDate?: string | null): Observable<any> {
    const payload = { logType, itemsPerPage, page, startDate, endDate };
    console.log('RECORDS SERVICE', payload); // To verify the correct payload is sent
    return this.http.post<any>(this.logsUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  } 

  getLogs(
    logType: string,
    itemsPerPage: number,
    page: number,
    searchTerm?: string | null,
    startDate?: string | null,
    endDate?: string | null
  ): Observable<any> {
    const payload: any = { logType, itemsPerPage, page };
  
    // Include searchTerm only if it is provided and not an empty string.
    if (searchTerm && searchTerm.trim() !== '' && !(startDate && endDate)) {
      payload.searchTerm = searchTerm;
    }
  
    // Always add startDate and endDate if they are provided.
    if (startDate) {
      payload.startDate = startDate;
    }
  
    if (endDate) {
      payload.endDate = endDate;
    }
  
    console.log('RECORDS SERVICE PAYLOAD', payload); // Log the request payload
  
    return this.http.post<any>(this.logsUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap(response => console.log('RECORDS SERVICE RESPONSE', response)), // Log the response
      catchError(this.handleError)
    );
  }
  
  

  getRecords(recordType: string, itemsPerPage: number, page: number, searchTerm?: string): Observable<any> {
    const payload = { recordType, itemsPerPage, page, searchTerm };
    console.log('GET RECORDS PAYLOAD:', payload); // Log payload for getRecords
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

  deleteVisitor(user_id: number): Observable<any> {
    const payload = { user_id };
    return this.http.post<any>(this.deleteVisitorUrl, payload, {
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

  deleteStudent(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/delete_student.php`;
    return this.http.post<any>(url, { user_id: userId }, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }
}
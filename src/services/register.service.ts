import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class RegisterService {
  private apiUrl = `${environment.apiUrl}/register.php`;
  private checkUserUrl = `${environment.apiUrl}/check_registration.php`;
  private validateStudentUrl = `${environment.apiUrl}/validate_student.php`;

  constructor(private http: HttpClient) {}

  registerUser(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  checkUserExists(role: string, identifier: string, contact: string): Observable<any> {
    const data = { role, identifier, contact };
    return this.http.post<any>(this.checkUserUrl, data);
  }

  validateStudent(studentLname: string, studentNo: string): Observable<any> {
    const data = { studentLname, studentNo };
    return this.http.post<any>(this.validateStudentUrl, data);
  }
}
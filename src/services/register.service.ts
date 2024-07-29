import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';
@Injectable()
export class RegisterService {

  private apiUrl = `${environment.apiUrl}/register.php`;

  constructor(private http: HttpClient) { }

  registerUser(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
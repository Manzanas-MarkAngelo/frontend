import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment'; // Import lang yung environment
@Injectable()
export class RegisterService {

  private apiUrl = `${environment.apiUrl}/register.php`; // add lang before yung sepcific php file

  constructor(private http: HttpClient) { }

  registerUser(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}

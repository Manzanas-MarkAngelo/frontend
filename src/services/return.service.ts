import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private borrowingDataUrl = `${environment.apiUrl}/fetch_borrowing_data.php`;
  private returnBookUrl = `${environment.apiUrl}/return_book.php`;
  private generatePenaltyUrl = `${environment.apiUrl}/generate_penalty.php`;

  constructor(private http: HttpClient) {}

  getBorrowingData(dateFrom?: string | null, dateTo?: string | null, remark: string = '', searchTerm: string = ''): Observable<any> {
    let params = new HttpParams();
  
    // Set date range if provided
    if (dateFrom && dateTo) {
      params = params.set('startDate', dateFrom).set('endDate', dateTo);
    }
  
    // Set remark if provided
    if (remark) {
      params = params.set('remark', remark);
    }
  
    // Set search term if provided
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
  
    // Make the GET request with the constructed params
    return this.http.get<any>(this.borrowingDataUrl, { params });
  }
  

  searchBorrowingData(term: string, page: number, limit: number, dateFrom?: string | null, dateTo?: string | null): Observable<any> {
    let params = new HttpParams()
      .set('searchTerm', term)
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (dateFrom && dateTo) {
      params = params.set('startDate', dateFrom).set('endDate', dateTo);
    }
    
    // Log the payload for debugging
    console.log('searchBorrowingData payload:', params.toString());

    return this.http.get<any>(this.borrowingDataUrl, { params });
  }

  returnBook(material_id: number): Observable<any> {
    return this.http.post<any>(this.returnBookUrl, { material_id });
  }

  generatePenalty(material_id: number): Observable<any> {
    return this.http.post<any>(this.generatePenaltyUrl, { material_id });
  }

  updateRemark(material_id: number, remark: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/update_remark.php`, { material_id, remark });
  }
}

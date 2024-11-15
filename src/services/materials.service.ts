import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class MaterialsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getMaterials(page: number, limit: number, sortField?: string, sortOrder?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField || 'date_added')
      .set('sortOrder', sortOrder || 'DESC');
    
    return this.http.get<any>(`${this.apiUrl}/fetch_materials.php`, { params });
  }
  
  searchMaterials(term: string, page: number, limit: number, sortField?: string, sortOrder?: string): Observable<any> {
    let params = new HttpParams()
      .set('search', term)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField || 'date_added')
      .set('sortOrder', sortOrder || 'DESC');
    
    return this.http.get<any>(`${this.apiUrl}/fetch_materials.php`, { params });
  }

  filterMaterialsByCategory(category: string, page: number, limit: number, sortField?: string, sortOrder?: string): Observable<any> {
    let params = new HttpParams()
      .set('category', category)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField || 'date_added')
      .set('sortOrder', sortOrder || 'DESC');

    return this.http.get<any>(`${this.apiUrl}/fetch_materials.php`, { params });
  }

  searchMaterialsByCategory(term: string, category: string, page: number, limit: number, sortField?: string, sortOrder?: string): Observable<any> {
    let params = new HttpParams()
      .set('search', term)
      .set('category', category)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField || 'date_added')
      .set('sortOrder', sortOrder || 'DESC');
    
    return this.http.get<any>(`${this.apiUrl}/fetch_materials.php`, { params });
  }

  getMaterialDetails(accnum: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_material_details.php?accnum=${accnum}`);
  }

  updateMaterial(material: any): Observable<any> {
    console.log('Payload being sent to update material:', material);
    return this.http.post<any>(`${this.apiUrl}/update_material.php`, material);
  }
  

  deleteMaterial(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_material.php`, { id });
  }

  deleteMultipleMaterials(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_material.php`, { ids });
  }  

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_categories.php`);
  }

  getCategory(cat_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_categories.php?cat_id=${cat_id}`);
  }

  updateCategory(cat_id: string, categoryDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/edit_category.php`, { cat_id, ...categoryDetails });
  }

    deleteCategory(cat_id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_category.php`, { cat_id });
  }

  weedOutMaterials(materialIds: number[]): Observable<any> {  
    return this.http.post<any>(`${this.apiUrl}/weed_out_materials.php`, { materialIds });
  }

  getAllMaterialIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/fetch_materials.php?fetchAllIds=true`);
  }  
}
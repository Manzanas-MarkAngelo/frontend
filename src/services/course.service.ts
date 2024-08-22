import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';

@Injectable()
export class CourseService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch_courses.php`);
  }

  addCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add_course.php`, courseData);
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/update_course.php?id=${id}`);
  }

  updateCourse(id: number, course: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update_course.php`, { id, course });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_course.php`, { courseId });
  }
}
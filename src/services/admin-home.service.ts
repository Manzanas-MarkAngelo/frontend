import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/local-environment';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AdminHomeService {
  private apiUrl = `${environment.apiUrl}/upload_student_csv.php`;
  private readLibraryHoursUrl = `${environment.apiUrl}/read_library_hours.php`; // Path to the PHP read file
  private updateLibraryHoursUrl = `${environment.apiUrl}/update_library_hours.php`; // Path to the PHP update file


  constructor(private http: HttpClient) {}

  uploadStudentCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData);
  }

  uploadFacultyCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/upload_faculty.php`, formData).pipe(
      tap(response => {
        console.log('Upload Faculty CSV Response:', response);
      })
    );
  }
  

  // Get library hours from the database
  getLibraryHours(): Observable<any> {
    return this.http.get(this.readLibraryHoursUrl);
  }

  // Update library hours in the database
  updateLibraryHours(updatedHours: { openingTime: string; closingTime: string }): Observable<any> {
    return this.http.post(this.updateLibraryHoursUrl, updatedHours);
  }

    // Check if the current time is within library hours
    isLibraryOpen(): Observable<boolean> {
      return new Observable<boolean>((observer) => {
        this.getLibraryHours().subscribe(libraryHours => {
          if (libraryHours && libraryHours.opening_time && libraryHours.closing_time) {
            const currentDate = new Date();
            const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes(); // current time in minutes
  
            // Parse opening and closing times from backend (convert to minutes)
            const [openingHour, openingMinute] = libraryHours.opening_time.split(':').map(Number);
            const [closingHour, closingMinute] = libraryHours.closing_time.split(':').map(Number);
  
            const openingTimeInMinutes = openingHour * 60 + openingMinute;
            const closingTimeInMinutes = closingHour * 60 + closingMinute;
  
            // Check if current time is outside library hours
            if (currentTime < openingTimeInMinutes || currentTime > closingTimeInMinutes) {
              observer.next(false);  // Library is closed
            } else {
              observer.next(true);  // Library is open
            }
            observer.complete();
          } else {
            console.error('Library hours are not properly defined:', libraryHours);
            observer.next(false);  // Fallback, library closed
            observer.complete();
          }
        });
      });
    }
}

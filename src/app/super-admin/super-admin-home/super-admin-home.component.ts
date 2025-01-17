import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../services/environments/local-environment';
import { AdminHomeService } from '../../../services/admin-home.service';

@Component({
  selector: 'app-super-admin-home',
  templateUrl: './super-admin-home.component.html',
  styleUrl: './super-admin-home.component.css'
})
export class SuperAdminHomeComponent {
  studentFileName: string | null = null; // Store the student file name
  facultyFileName: string | null = null; // Store the faculty file name

  constructor(private http: HttpClient,
              private adminHomeService: AdminHomeService) {}
  
  ngOnInit(): void {
    this.loadLibraryHours();
  }             
  openingTime: string = '';
  closingTime: string = ''; 
  isLibraryOpen: boolean = true;

    // Method to handle file selection for students
    onStudentFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type === 'text/csv') {
          this.studentFileName = file.name;
  
          this.adminHomeService.uploadStudentCsv(file).subscribe(
            response => {
              alert('File processed successfully!');
            },
            error => {
              alert('An error occurred while processing the file.');
            }
          );
        } else {
          this.studentFileName = null;
          alert('Please upload a valid CSV file.');
        }
      }
    }

  // Method to handle file selection for faculty
  onFacultyFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'text/csv') {
        this.facultyFileName = file.name;
  
        this.adminHomeService.uploadFacultyCsv(file).subscribe(
          response => {
            alert('Faculty file processed successfully!');
          },
          error => {
            alert('An error occurred while processing the faculty file.');
          }
        );
      } else {
        this.facultyFileName = null;
        alert('Please upload a valid CSV file for faculty.');
      }
    }
  }


  // Load library hours from the backend
  loadLibraryHours(): void {
    this.adminHomeService.getLibraryHours().subscribe(
      (data: any) => {
        this.openingTime = data.opening_time;
        this.closingTime = data.closing_time;
      },
      error => {
        alert('Error loading library hours!');
      }
    );
  }

  // Save library hours to the backend
  saveLibraryHours(): void {
    const updatedHours = {
      openingTime: this.openingTime,
      closingTime: this.closingTime,
    };

    this.adminHomeService.updateLibraryHours(updatedHours).subscribe(
      () => {
        alert(`Library hours updated:\nOpen: ${this.openingTime}\nClose: ${this.closingTime}`);
      },
      error => {
        alert('Error updating library hours!');
      }
    );
  }

    // Convert time string (HH:MM) to total minutes
    private getMinutesFromTime(time: string): number {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
}

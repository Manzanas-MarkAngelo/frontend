import { Component } from '@angular/core';

@Component({
  selector: 'app-super-admin-home',
  templateUrl: './super-admin-home.component.html',
  styleUrl: './super-admin-home.component.css'
})
export class SuperAdminHomeComponent {
  studentFileName: string | null = null; // Store the student file name
  facultyFileName: string | null = null; // Store the faculty file name
  
  openingTime: string = '08:00'; // Default opening time
  closingTime: string = '17:00'; // Default closing time
  isLibraryOpen: boolean = true;

    // Method to handle file selection for students
    onStudentFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type === 'text/csv') {
          this.studentFileName = file.name;
        } else {
          this.studentFileName = null;
          alert('Please upload a valid CSV file for students.');
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
      } else {
        this.facultyFileName = null;
        alert('Please upload a valid CSV file for faculty.');
      }
    }
  }
  
    // Save the library hours
    saveLibraryHours(): void {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const openingMinutes = this.getMinutesFromTime(this.openingTime);
      const closingMinutes = this.getMinutesFromTime(this.closingTime);
  
      if (currentTime >= openingMinutes && currentTime <= closingMinutes) {
        this.isLibraryOpen = true;
      } else {
        this.isLibraryOpen = false;
      }
      alert(`Library hours updated:\nOpen: ${this.openingTime}\nClose: ${this.closingTime}`);
    }
  
    // Convert time string (HH:MM) to total minutes
    private getMinutesFromTime(time: string): number {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
}

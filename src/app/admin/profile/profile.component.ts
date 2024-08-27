import { Component, OnInit } from '@angular/core';
import { LibrarianService } from '../../../services/librarian.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  librarianData: any = {}; // Initialize with an empty object
  isEditMode = false; // Flag to toggle edit mode

  constructor(private librarianService: LibrarianService) { }

  ngOnInit(): void {
    const librarianId = 1; // Assuming you have the librarian's ID available
    this.librarianService.getLibrarianById(librarianId).subscribe(data => {
      this.librarianData = data;
    });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.saveChanges(); // Save changes if we are exiting edit mode
    }
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    const librarianId = 1; // Use the same ID as above
    this.librarianService.updateLibrarian(librarianId, this.librarianData).subscribe(response => {
      console.log(response.message); // Handle the response as needed
    });
  }
}
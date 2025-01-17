import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LibrarianService } from '../../../services/librarian.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {

  constructor(private router: Router,
              private librarianService: LibrarianService,
  ) { }

  librarianData: any = {};
  librarianName: string = '';

  ngOnInit(): void {
    const librarianId = 1;
    this.librarianService.getLibrarianById(librarianId).subscribe(data => {
      this.librarianData = data;
      this.librarianName = this.librarianData.name;
 
    });
  }

  onLogoutClick() {
    this.router.navigate(['/logout-warning']);
  }
}

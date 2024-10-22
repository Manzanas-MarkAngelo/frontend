import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialsService } from '../../../services/materials.service';
import { AddMaterialService } from '../../../services/add-material.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-materials-edit',  
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.css']
})
export class MaterialsEditComponent implements OnInit {
  material: any = {};
  categories: { cat_id: number, mat_type: string }[] = []; // Holds cat_id and mat_type
  selectedCategory: { cat_id: number, mat_type: string } | null = null; // To display mat_type in dropdown
  isDropdownOpen: boolean = false;
  showModal: boolean = false;
  isSubjectDropdownOpen = false; 
  selectedSubject: any;
  subjectSearchTerm = '';
  filteredSubjects: any[] = []; // Populate this list with your subjects
  subjects: { id: number, subject_name: string }[] = [];  // Holds subject ids and headings

  constructor(
    private route: ActivatedRoute,
    private materialsService: MaterialsService,
    private addMaterialService: AddMaterialService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Fetch categories from the database
    this.materialsService.getCategories().subscribe(data => {
      this.categories = data.map((category: any) => ({
        cat_id: category.cat_id,
        mat_type: category.mat_type
      }));

      const accnum = this.route.snapshot.paramMap.get('accnum');
      if (accnum) {
        this.materialsService.getMaterialDetails(accnum).subscribe(data => {
          this.material = data;
          this.populateForm();
        });
      }
    });
    this.fetchSubjects();
  }

    // Fetch subjects from the service
    fetchSubjects(searchTerm: string = ''): void {
      this.addMaterialService.getSubjectHeadings(searchTerm).subscribe(data => {
        this.subjects = data.map((subject: any) => ({
          id: subject.id,
          subject_name: subject.subject_name
        }));
        this.filteredSubjects = [...this.subjects]; // Initially show all subjects
      });
    }

  // Search for subjects based on the input term
  onSubjectSearch(term: string): void {
    this.fetchSubjects(term); // Fetch subjects based on search term
  }

  goBack(): void {
    this.location.back();
  }

  populateForm(): void {
    this.material.title = this.material.title || 'unknown/empty';
    this.material.subj = this.material.subj || 'unknown/empty';
    this.material.accnum = this.material.accnum || 'unknown/empty';
    this.material.category = this.material.categoryid || 0; // Default to 0 if no category
    this.material.author = this.material.author || 'unknown/empty';
    this.material.callno = this.material.callno || 'unknown/empty';
    this.material.copyright = this.material.copyright || 'unknown/empty';
    this.material.publisher = this.material.publisher || 'unknown/empty';
    this.material.edition = this.material.edition || 'unknown/empty';
    this.material.isbn = this.material.isbn || 'unknown/empty';
    this.material.status = this.material.status || 'unknown/empty';
    this.setSubject();

    // Find the selected category based on category ID
    const selectedCategory = this.categories.find(c => c.cat_id === this.material.category);
    if (selectedCategory) {
      this.selectedCategory = selectedCategory; // Set the selected category for display
    } else {
      this.selectedCategory = { cat_id: 0, mat_type: 'Select Category' }; // Default display if none found
    }
  }

  setSubject() {
    let id, subject_name;
    id = this.material.subject_id;
    subject_name = this.material.subject_name;
    this.selectedSubject = { id, subject_name };  // Display selected heading in dropdown
    this.isSubjectDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectSubjectHeading(id: number, subject_name: string): void {
    //this.subject_id = id;
    //console.log(`Name: ${subject_name} ID: ${this.subject_id}`)
    //this.bookDetails.heading = id;  // Set the subject heading in bookDetails
    this.selectedSubject = { id, subject_name };  // Display selected heading in dropdown
    this.isSubjectDropdownOpen = false;
    this.material.subject_id = id;
  }

  selectCategory(cat_id: number, mat_type: string): void {
    this.material.category = cat_id;  // Set the category ID in material
    this.selectedCategory = { cat_id, mat_type };  // Display selected mat_type in dropdown
    this.isDropdownOpen = false;
  }

  showConfirmModal(): void {
    this.showModal = true;
  }

  closeConfirmModal(): void {
    this.showModal = false;
  }

  saveChanges(): void {
    this.materialsService.updateMaterial(this.material).subscribe(
      response => {
        if (response.status === 'success') {
          console.log('Update successful');
          this.router.navigate(['/materials-success']);
        } else {
          console.log('Update failed', response.message);
        }
        this.showModal = false;
      },
      error => {
        console.error('Request failed', error);
        this.showModal = false;
      }
    );
  }

  toggleSubjectDropdown() {
    this.isSubjectDropdownOpen = !this.isSubjectDropdownOpen;
  }
}

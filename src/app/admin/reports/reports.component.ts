import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  inventoryPlaceholder: string = 'Inventory';
  categoryPlaceholder: string = 'Category'
  programPlaceholder: string = 'Program'
  dropdownOpen: boolean = false;

  InventoryPlaceholder(value: string) {
    this.inventoryPlaceholder = value;
  }

  CategoryPlaceholder(value: string) {
    this.categoryPlaceholder = value;
  }

  ProgramPlaceholder(value: string) {
    this.programPlaceholder = value;
  }
}

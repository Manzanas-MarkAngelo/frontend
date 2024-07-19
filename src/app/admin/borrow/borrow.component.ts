import { Component } from '@angular/core';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrl: './borrow.component.css'
})
export class BorrowComponent {
  categoryPlaceholder: string = 'Category'

  CategoryPlaceholder(value: string) {
    this.categoryPlaceholder = value;
  }

}

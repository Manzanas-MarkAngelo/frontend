import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-client-snackbar',
  templateUrl: './client-snackbar.component.html',
  styleUrl: './client-snackbar.component.css'
})
export class ClientSnackbarComponent {
  @Input() message: string = '';
  isVisible: boolean = false;

  showMessage(message: string): void {
    this.message = message;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }
}
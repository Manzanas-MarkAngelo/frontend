import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  userMessage = '';
  encryptedMessage = '';
  decryptionKey = ''; // Start as an empty string
  decryptedMessage = ''; // For displaying the decrypted message
  correctKey = ''; // Example key, replace with your logic
  errorMessage = '';

  encryptMessage() {
    if (this.userMessage) {
      this.encryptedMessage = btoa(this.userMessage); // Basic Base64 encoding
      this.userMessage = ''; // Clear input after encryption
    }
  }

  showModal() {
    const modal = document.getElementById('decryptModal') as HTMLDialogElement;
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('decryptModal') as HTMLDialogElement;
    this.errorMessage = '';
    this.decryptionKey = ''; // Reset decryption key
    this.decryptedMessage = ''; // Reset decrypted message
    modal?.close(); // Close the modal explicitly
  }

  decryptMessage() {
    if (this.decryptionKey === this.correctKey) {
      this.decryptedMessage = atob(this.encryptedMessage); // Decode Base64
      this.errorMessage = ''; // Clear error message
    } else {
      this.errorMessage = 'Incorrect decryption key.'; // Show error message
    }
  }
}

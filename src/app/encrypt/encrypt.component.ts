import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrl: './encrypt.component.css',
})
export class EncryptComponent {
  userMessage = '';
  encryptedMessage = '';
  decryptionKey = '';
  correctKey = '1234'; // Example key, replace with your logic
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
    modal?.close();
    this.errorMessage = '';
    this.decryptionKey = '';
  }

  decryptMessage() {
    if (this.decryptionKey === this.correctKey) {
      this.encryptedMessage = atob(this.encryptedMessage); // Decode Base64
      this.closeModal();
    } else {
      this.errorMessage = 'Incorrect decryption key.';
    }
  }

}

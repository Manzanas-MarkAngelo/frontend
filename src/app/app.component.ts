import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message: string = '';
  encryptedMessage: string = '';
  decryptedMessage: string = '';
  userKey: string = '';
  validationMessage: string = '';
  isDecryptionVisible: boolean = false;

  // Character table for index lookup
  characterTable: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \n\t'.split('');

  salt: string = 'AnNoMaRy4';

  // Method to generate the encryption key (k) from salt
  generateKeyFromMessageAndSalt(): number {
    // Step 1: Convert Message to ASCII and Sum the Values
    let messageSum = this.message.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    console.log('Message Sum:', messageSum); // Debugging step
  
    // Step 2: Apply Transformation (Multiply by Constant 2708 and Modulo with 1000000)
    let transformedKeySeed = (messageSum * 2708) % 1000000;
    console.log('Transformed Key Seed:', transformedKeySeed); // Debugging step
  
    // Step 3: Convert Salt to ASCII and Sum the Values
    let saltSum = this.salt.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    console.log('Salt Sum:', saltSum); // Debugging step
  
    // Step 4: Combine the Salt Sum with the Transformed Key Seed and Apply Modulo
    let finalKey = (transformedKeySeed + saltSum) % 1000000;
    console.log('Final Key:', finalKey); // Debugging step
  
    return finalKey; // Final key is ready
  }
  

  // Method to encrypt the message
  encryptMessage(): void {
    const k = this.generateKeyFromMessageAndSalt();  // Using salt to generate the key

    let encrypted = this.message.split('').map(char => {
      let index = this.characterTable.indexOf(char);
      let newIndex = (index + k) % 96; // Apply shift and wrap around using modulo
      console.log(`Encrypting '${char}' (Index: ${index}) -> '${this.characterTable[newIndex]}' (New Index: ${newIndex})`);
      return this.characterTable[newIndex];
    }).join('');
    
    this.encryptedMessage = encrypted;
    console.log('Encrypted Message:', this.encryptedMessage);
  }

  // Method to decrypt the message
  decryptMessage(): void {
    const k = this.generateKeyFromMessageAndSalt(); // Use the same key generated from the message and salt
    const userInputKey = Number(this.userKey);  // Convert the user's input key to number
  
    // Validate the entered key
    if (userInputKey !== k) {
      this.validationMessage = 'Incorrect key! Please try again.';
      return;
    } else {
      this.validationMessage = '';  // Clear any error message
    }
  
    let decrypted = this.encryptedMessage.split('').map(char => {
      let index = this.characterTable.indexOf(char);
      
      // Adjust the index to make sure it stays within the bounds
      let newIndex = (index - userInputKey + 96) % 96;
      if (newIndex < 0) newIndex += 96; // Fix any negative index values
      
      console.log(`Decrypting '${char}' (Index: ${index}) -> '${this.characterTable[newIndex]}' (New Index: ${newIndex})`);
      return this.characterTable[newIndex];
    }).join('');
    
    this.decryptedMessage = decrypted;
    console.log('Decrypted Message:', this.decryptedMessage);
  }
  

  toggleDecryptionField(): void {
    this.isDecryptionVisible = !this.isDecryptionVisible;
    console.log('Decryption field visible:', this.isDecryptionVisible);
  }
}


// WORKINGSS
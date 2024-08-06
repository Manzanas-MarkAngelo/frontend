import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SnackbarService {
  private snackbarSubject = new Subject<{ message: string }>();

  snackbarState$ = this.snackbarSubject.asObservable();

  showSnackbar(message: string) {
    this.snackbarSubject.next({ message });
  }
}

import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-snackbar-delete',
  templateUrl: './snackbar-delete.component.html',
  styleUrls: ['./snackbar-delete.component.css']
})
export class SnackbarDeleteComponent implements OnInit {
  snackBarMessage = '';
  snackBarVisible: boolean = false;

  constructor(private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.snackbarService.snackbarState$.subscribe(state => {
      this.snackBarMessage = state.message;
      this.showSnackBar();
    });
  }

  showSnackBar(): void {
    this.snackBarVisible = true;
    setTimeout(() => {
      this.snackBarVisible = false;
    }, 5000);
  }

  closeSnackBar(): void {
    this.snackBarVisible = false;
  }
}

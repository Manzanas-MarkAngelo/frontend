import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReturnService } from '../../../services/return.service';

@Component({
  selector: 'app-return-warning',
  templateUrl: './return-warning.component.html',
  styleUrls: ['./return-warning.component.css']
})
export class ReturnWarningComponent implements OnInit {
  materialId: number;

  constructor(
    private returnService: ReturnService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.materialId = Number(this.route.snapshot.paramMap.get('material_id'));

    if (isNaN(this.materialId) || this.materialId === 0) {
      alert('Invalid material ID.');
      this.router.navigate(['/return']);
    }
  }

  onConfirmReturn() {
    this.returnService.returnBook(this.materialId).subscribe(response => {
      if (response.status === 'success') {
        this.router.navigate(['/return-success']);
      } else {
        alert('Error returning book: ' + response.message);
      }
    });
  }
}
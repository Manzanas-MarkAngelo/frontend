import { TestBed } from '@angular/core/testing';

import { PdfPenaltyReceiptService } from './pdf-penalty-receipt.service';

describe('PdfPenaltyReceiptService', () => {
  let service: PdfPenaltyReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfPenaltyReceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

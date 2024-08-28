import { TestBed } from '@angular/core/testing';

import { PdfReportBorrowersService } from './pdf-report-borrowers.service';

describe('PdfReportBorrowersService', () => {
  let service: PdfReportBorrowersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfReportBorrowersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

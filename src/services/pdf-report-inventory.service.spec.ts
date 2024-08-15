import { TestBed } from '@angular/core/testing';

import { PdfReportInventoryService } from './pdf-report-inventory.service';

describe('PdfReportInventoryService', () => {
  let service: PdfReportInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfReportInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

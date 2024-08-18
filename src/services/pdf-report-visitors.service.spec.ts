import { TestBed } from '@angular/core/testing';

import { PdfReportVisitorsService } from './pdf-report-visitors.service';

describe('PdfReportVisitorsService', () => {
  let service: PdfReportVisitorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfReportVisitorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

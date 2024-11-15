import { TestBed } from '@angular/core/testing';

import { PdfReportEmployeesService } from './pdf-report-employees.service';

describe('PdfReportEmployeesService', () => {
  let service: PdfReportEmployeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfReportEmployeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

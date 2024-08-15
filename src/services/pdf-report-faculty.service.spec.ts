import { TestBed } from '@angular/core/testing';

import { PdfReportFacultyService } from './pdf-report-faculty.service';

describe('PdfReportFacultyService', () => {
  let service: PdfReportFacultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfReportFacultyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

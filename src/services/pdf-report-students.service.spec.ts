import { TestBed } from '@angular/core/testing';

import { PdfReportStudentsService } from './pdf-report-students.service';

describe('PdfReportStudentsService', () => {
  let service: PdfReportStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfReportStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

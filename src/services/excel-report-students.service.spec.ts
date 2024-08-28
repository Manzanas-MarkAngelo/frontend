import { TestBed } from '@angular/core/testing';

import { ExcelReportStudentsService } from './excel-report-students.service';

describe('ExcelReportStudentsService', () => {
  let service: ExcelReportStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelReportStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ExcelReportFacultyService } from './excel-report-faculty.service';

describe('ExcelReportFacultyService', () => {
  let service: ExcelReportFacultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelReportFacultyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

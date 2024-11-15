import { TestBed } from '@angular/core/testing';

import { ExcelReportEmployeesService } from './excel-report-employees.service';

describe('ExcelReportEmployeesService', () => {
  let service: ExcelReportEmployeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelReportEmployeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ExcelReportBorrowersService } from './excel-report-borrowers.service';

describe('ExcelReportBorrowersService', () => {
  let service: ExcelReportBorrowersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelReportBorrowersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

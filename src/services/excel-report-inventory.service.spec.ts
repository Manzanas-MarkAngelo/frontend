import { TestBed } from '@angular/core/testing';

import { ExcelReportInventoryService } from './excel-report-inventory.service';

describe('ExcelReportInventoryService', () => {
  let service: ExcelReportInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelReportInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

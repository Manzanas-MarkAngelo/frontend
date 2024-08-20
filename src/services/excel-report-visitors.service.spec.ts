import { TestBed } from '@angular/core/testing';

import { ExcelReportVisitorsService } from './excel-report-visitors.service';

describe('ExcelReportVisitorsService', () => {
  let service: ExcelReportVisitorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelReportVisitorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

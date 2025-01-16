import { TestBed } from '@angular/core/testing';

import { ExcludeDaysService } from './exclude-days.service';

describe('ExcludeDaysService', () => {
  let service: ExcludeDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcludeDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

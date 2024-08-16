import { TestBed } from '@angular/core/testing';

import { CurrentDateYearService } from './current-date-year.service';

describe('CurrentDateYearService', () => {
  let service: CurrentDateYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentDateYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { BookRequestService } from './book-request.service';

describe('BookRequestService', () => {
  let service: BookRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

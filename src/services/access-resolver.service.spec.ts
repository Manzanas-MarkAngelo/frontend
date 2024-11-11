import { TestBed } from '@angular/core/testing';

import { AccessResolverService } from './access-resolver.service';

describe('AccessResolverService', () => {
  let service: AccessResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ClientLoginService } from './client-login.service';

describe('ClientLoginService', () => {
  let service: ClientLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

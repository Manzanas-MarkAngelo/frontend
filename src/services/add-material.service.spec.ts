import { TestBed } from '@angular/core/testing';

import { AddMaterialService } from './add-material.service';

describe('AddMaterialService', () => {
  let service: AddMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

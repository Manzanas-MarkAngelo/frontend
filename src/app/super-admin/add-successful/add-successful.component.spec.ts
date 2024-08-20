import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuccessfulComponent } from './add-successful.component';

describe('AddSuccessfulComponent', () => {
  let component: AddSuccessfulComponent;
  let fixture: ComponentFixture<AddSuccessfulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSuccessfulComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

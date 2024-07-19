import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeWarningComponent } from './add-type-warning.component';

describe('AddTypeWarningComponent', () => {
  let component: AddTypeWarningComponent;
  let fixture: ComponentFixture<AddTypeWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTypeWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

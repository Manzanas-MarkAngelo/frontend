import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepartmentSuccessComponent } from './add-department-success.component';

describe('AddDepartmentSuccessComponent', () => {
  let component: AddDepartmentSuccessComponent;
  let fixture: ComponentFixture<AddDepartmentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDepartmentSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDepartmentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

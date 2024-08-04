import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacultySuccessComponent } from './add-faculty-success.component';

describe('AddFacultySuccessComponent', () => {
  let component: AddFacultySuccessComponent;
  let fixture: ComponentFixture<AddFacultySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFacultySuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFacultySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

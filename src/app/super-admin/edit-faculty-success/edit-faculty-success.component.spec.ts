import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFacultySuccessComponent } from './edit-faculty-success.component';

describe('EditFacultySuccessComponent', () => {
  let component: EditFacultySuccessComponent;
  let fixture: ComponentFixture<EditFacultySuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditFacultySuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFacultySuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

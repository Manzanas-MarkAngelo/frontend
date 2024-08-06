import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitorComponent } from './add-visitor.component';

describe('AddVisitorComponent', () => {
  let component: AddVisitorComponent;
  let fixture: ComponentFixture<AddVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

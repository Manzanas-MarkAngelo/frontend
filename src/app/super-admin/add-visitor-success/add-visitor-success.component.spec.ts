import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitorSuccessComponent } from './add-visitor-success.component';

describe('AddVisitorSuccessComponent', () => {
  let component: AddVisitorSuccessComponent;
  let fixture: ComponentFixture<AddVisitorSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddVisitorSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVisitorSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

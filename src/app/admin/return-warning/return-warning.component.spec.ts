import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnWarningComponent } from './return-warning.component';

describe('ReturnWarningComponent', () => {
  let component: ReturnWarningComponent;
  let fixture: ComponentFixture<ReturnWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

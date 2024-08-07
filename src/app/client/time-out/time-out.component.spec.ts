import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOutComponent } from './time-out.component';

describe('TimeOutComponent', () => {
  let component: TimeOutComponent;
  let fixture: ComponentFixture<TimeOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

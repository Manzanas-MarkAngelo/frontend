import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutSuccessComponent } from './timeout-success.component';

describe('TimeoutSuccessComponent', () => {
  let component: TimeoutSuccessComponent;
  let fixture: ComponentFixture<TimeoutSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeoutSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeoutSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

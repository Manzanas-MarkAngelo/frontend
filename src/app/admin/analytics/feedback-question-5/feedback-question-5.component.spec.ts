import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion5Component } from './feedback-question-5.component';

describe('FeedbackQuestion5Component', () => {
  let component: FeedbackQuestion5Component;
  let fixture: ComponentFixture<FeedbackQuestion5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

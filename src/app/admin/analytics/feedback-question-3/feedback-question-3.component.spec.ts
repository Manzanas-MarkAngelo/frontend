import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion3Component } from './feedback-question-3.component';

describe('FeedbackQuestion3Component', () => {
  let component: FeedbackQuestion3Component;
  let fixture: ComponentFixture<FeedbackQuestion3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

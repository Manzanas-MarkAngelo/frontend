import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion1Component } from './feedback-question-1.component';

describe('FeedbackQuestion1Component', () => {
  let component: FeedbackQuestion1Component;
  let fixture: ComponentFixture<FeedbackQuestion1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

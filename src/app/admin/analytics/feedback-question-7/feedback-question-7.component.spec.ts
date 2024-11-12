import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion7Component } from './feedback-question-7.component';

describe('FeedbackQuestion7Component', () => {
  let component: FeedbackQuestion7Component;
  let fixture: ComponentFixture<FeedbackQuestion7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

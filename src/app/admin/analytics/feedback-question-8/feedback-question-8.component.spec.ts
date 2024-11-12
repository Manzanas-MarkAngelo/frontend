import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion8Component } from './feedback-question-8.component';

describe('FeedbackQuestion8Component', () => {
  let component: FeedbackQuestion8Component;
  let fixture: ComponentFixture<FeedbackQuestion8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion8Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

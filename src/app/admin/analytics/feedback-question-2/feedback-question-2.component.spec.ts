import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion2Component } from './feedback-question-2.component';

describe('FeedbackQuestion2Component', () => {
  let component: FeedbackQuestion2Component;
  let fixture: ComponentFixture<FeedbackQuestion2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

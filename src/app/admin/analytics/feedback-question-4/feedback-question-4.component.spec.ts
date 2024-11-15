import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion4Component } from './feedback-question-4.component';

describe('FeedbackQuestion4Component', () => {
  let component: FeedbackQuestion4Component;
  let fixture: ComponentFixture<FeedbackQuestion4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

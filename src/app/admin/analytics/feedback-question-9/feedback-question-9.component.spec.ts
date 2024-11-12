import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion9Component } from './feedback-question-9.component';

describe('FeedbackQuestion9Component', () => {
  let component: FeedbackQuestion9Component;
  let fixture: ComponentFixture<FeedbackQuestion9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion9Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion6Component } from './feedback-question-6.component';

describe('FeedbackQuestion6Component', () => {
  let component: FeedbackQuestion6Component;
  let fixture: ComponentFixture<FeedbackQuestion6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

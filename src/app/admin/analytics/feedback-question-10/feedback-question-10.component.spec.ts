import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackQuestion10Component } from './feedback-question-10.component';

describe('FeedbackQuestion10Component', () => {
  let component: FeedbackQuestion10Component;
  let fixture: ComponentFixture<FeedbackQuestion10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackQuestion10Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackQuestion10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

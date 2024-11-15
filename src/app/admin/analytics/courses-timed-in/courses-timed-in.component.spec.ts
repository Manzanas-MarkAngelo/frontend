import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesTimedInComponent } from './courses-timed-in.component';

describe('CoursesTimedInComponent', () => {
  let component: CoursesTimedInComponent;
  let fixture: ComponentFixture<CoursesTimedInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursesTimedInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesTimedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

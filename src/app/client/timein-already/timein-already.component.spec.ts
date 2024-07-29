import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeinAlreadyComponent } from './timein-already.component';

describe('TimeinAlreadyComponent', () => {
  let component: TimeinAlreadyComponent;
  let fixture: ComponentFixture<TimeinAlreadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeinAlreadyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeinAlreadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

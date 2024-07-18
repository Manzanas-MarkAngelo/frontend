import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeinSuccessComponent } from './timein-success.component';

describe('TimeinSuccessComponent', () => {
  let component: TimeinSuccessComponent;
  let fixture: ComponentFixture<TimeinSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeinSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeinSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

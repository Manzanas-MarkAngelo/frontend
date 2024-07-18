import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTimeinComponent } from './no-timein.component';

describe('NoTimeinComponent', () => {
  let component: NoTimeinComponent;
  let fixture: ComponentFixture<NoTimeinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoTimeinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoTimeinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

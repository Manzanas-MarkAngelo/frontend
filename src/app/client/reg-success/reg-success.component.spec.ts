import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSuccessComponent } from './reg-success.component';

describe('RegSuccessComponent', () => {
  let component: RegSuccessComponent;
  let fixture: ComponentFixture<RegSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

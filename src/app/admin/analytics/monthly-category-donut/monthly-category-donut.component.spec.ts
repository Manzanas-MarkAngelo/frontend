import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyCategoryDonutComponent } from './monthly-category-donut.component';

describe('MonthlyCategoryDonutComponent', () => {
  let component: MonthlyCategoryDonutComponent;
  let fixture: ComponentFixture<MonthlyCategoryDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyCategoryDonutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyCategoryDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowSuccessComponent } from './borrow-success.component';

describe('BorrowSuccessComponent', () => {
  let component: BorrowSuccessComponent;
  let fixture: ComponentFixture<BorrowSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BorrowSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowInfoComponent } from './borrow-info.component';

describe('BorrowInfoComponent', () => {
  let component: BorrowInfoComponent;
  let fixture: ComponentFixture<BorrowInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BorrowInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

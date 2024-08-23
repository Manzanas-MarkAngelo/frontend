import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostBorrowedComponent } from './most-borrowed.component';

describe('MostBorrowedComponent', () => {
  let component: MostBorrowedComponent;
  let fixture: ComponentFixture<MostBorrowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostBorrowedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostBorrowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

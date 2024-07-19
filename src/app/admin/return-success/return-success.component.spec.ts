import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnSuccessComponent } from './return-success.component';

describe('ReturnSuccessComponent', () => {
  let component: ReturnSuccessComponent;
  let fixture: ComponentFixture<ReturnSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

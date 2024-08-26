import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyUsersComponent } from './monthly-users.component';

describe('MonthlyUsersComponent', () => {
  let component: MonthlyUsersComponent;
  let fixture: ComponentFixture<MonthlyUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

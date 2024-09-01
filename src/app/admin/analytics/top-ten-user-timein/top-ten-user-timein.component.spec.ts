import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTenUserTimeinComponent } from './top-ten-user-timein.component';

describe('TopTenUserTimeinComponent', () => {
  let component: TopTenUserTimeinComponent;
  let fixture: ComponentFixture<TopTenUserTimeinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopTenUserTimeinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTenUserTimeinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

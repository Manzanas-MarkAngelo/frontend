import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarDeleteComponent } from './snackbar-delete.component';

describe('SnackbarDeleteComponent', () => {
  let component: SnackbarDeleteComponent;
  let fixture: ComponentFixture<SnackbarDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackbarDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackbarDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

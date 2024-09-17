import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSnackbarComponent } from './client-snackbar.component';

describe('ClientSnackbarComponent', () => {
  let component: ClientSnackbarComponent;
  let fixture: ComponentFixture<ClientSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

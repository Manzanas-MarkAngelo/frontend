import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLispuptComponent } from './login-lispupt.component';

describe('LoginLispuptComponent', () => {
  let component: LoginLispuptComponent;
  let fixture: ComponentFixture<LoginLispuptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginLispuptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginLispuptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

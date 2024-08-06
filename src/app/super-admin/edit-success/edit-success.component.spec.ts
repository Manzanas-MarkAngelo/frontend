import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSuccessComponent } from './edit-success.component';

describe('EditSuccessComponent', () => {
  let component: EditSuccessComponent;
  let fixture: ComponentFixture<EditSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

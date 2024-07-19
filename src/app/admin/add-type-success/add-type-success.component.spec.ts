import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeSuccessComponent } from './add-type-success.component';

describe('AddTypeSuccessComponent', () => {
  let component: AddTypeSuccessComponent;
  let fixture: ComponentFixture<AddTypeSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTypeSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

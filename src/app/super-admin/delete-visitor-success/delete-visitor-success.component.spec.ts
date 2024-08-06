import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVisitorSuccessComponent } from './delete-visitor-success.component';

describe('DeleteVisitorSuccessComponent', () => {
  let component: DeleteVisitorSuccessComponent;
  let fixture: ComponentFixture<DeleteVisitorSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteVisitorSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteVisitorSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

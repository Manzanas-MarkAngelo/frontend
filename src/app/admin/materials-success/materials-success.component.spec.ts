import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsSuccessComponent } from './materials-success.component';

describe('MaterialsSuccessComponent', () => {
  let component: MaterialsSuccessComponent;
  let fixture: ComponentFixture<MaterialsSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialsSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

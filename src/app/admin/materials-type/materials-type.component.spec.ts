import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsTypeComponent } from './materials-type.component';

describe('MaterialsTypeComponent', () => {
  let component: MaterialsTypeComponent;
  let fixture: ComponentFixture<MaterialsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsWarningComponent } from './materials-warning.component';

describe('MaterialsWarningComponent', () => {
  let component: MaterialsWarningComponent;
  let fixture: ComponentFixture<MaterialsWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialsWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

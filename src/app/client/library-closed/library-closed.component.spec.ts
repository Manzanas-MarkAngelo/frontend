import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryClosedComponent } from './library-closed.component';

describe('LibraryClosedComponent', () => {
  let component: LibraryClosedComponent;
  let fixture: ComponentFixture<LibraryClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibraryClosedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

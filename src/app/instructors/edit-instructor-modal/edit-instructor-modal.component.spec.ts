import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstructorModalComponent } from './edit-instructor-modal.component';

describe('EditInstructorModalComponent', () => {
  let component: EditInstructorModalComponent;
  let fixture: ComponentFixture<EditInstructorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInstructorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInstructorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

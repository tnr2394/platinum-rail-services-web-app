import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstructorModalComponent } from './add-instructor-modal.component';

describe('AddInstructorModalComponent', () => {
  let component: AddInstructorModalComponent;
  let fixture: ComponentFixture<AddInstructorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInstructorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInstructorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

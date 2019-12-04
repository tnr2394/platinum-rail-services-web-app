import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorSubmissionComponent } from './instructor-submission.component';

describe('InstructorSubmissionComponent', () => {
  let component: InstructorSubmissionComponent;
  let fixture: ComponentFixture<InstructorSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

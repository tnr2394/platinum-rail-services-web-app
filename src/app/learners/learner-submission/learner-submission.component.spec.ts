import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerSubmissionComponent } from './learner-submission.component';

describe('LearnerSubmissionComponent', () => {
  let component: LearnerSubmissionComponent;
  let fixture: ComponentFixture<LearnerSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDatesComponent } from './job-dates.component';

describe('JobDatesComponent', () => {
  let component: JobDatesComponent;
  let fixture: ComponentFixture<JobDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

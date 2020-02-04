import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleInstructorComponent } from './single-instructor.component';

describe('SingleInstructorComponent', () => {
  let component: SingleInstructorComponent;
  let fixture: ComponentFixture<SingleInstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleInstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

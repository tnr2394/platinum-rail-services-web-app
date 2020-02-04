import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLearnerComponent } from './single-learner.component';

describe('SingleLearnerComponent', () => {
  let component: SingleLearnerComponent;
  let fixture: ComponentFixture<SingleLearnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleLearnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

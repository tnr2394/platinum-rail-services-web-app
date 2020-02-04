import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentStatusComponent } from './assignment-status.component';

describe('AssignmentStatusComponent', () => {
  let component: AssignmentStatusComponent;
  let fixture: ComponentFixture<AssignmentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateLearnerModalComponent } from './allocate-learner-modal.component';

describe('AllocateLearnerModalComponent', () => {
  let component: AllocateLearnerModalComponent;
  let fixture: ComponentFixture<AllocateLearnerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateLearnerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateLearnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

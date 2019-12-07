import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLearnerModalComponent } from './edit-learner-modal.component';

describe('EditLearnerModalComponent', () => {
  let component: EditLearnerModalComponent;
  let fixture: ComponentFixture<EditLearnerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLearnerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLearnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

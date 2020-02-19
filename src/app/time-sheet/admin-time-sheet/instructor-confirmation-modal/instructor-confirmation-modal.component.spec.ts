import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorConfirmationModalComponent } from './instructor-confirmation-modal.component';

describe('InstructorConfirmationModalComponent', () => {
  let component: InstructorConfirmationModalComponent;
  let fixture: ComponentFixture<InstructorConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

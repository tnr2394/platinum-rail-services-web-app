import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentConfirmationComponent } from './allotment-confirmation.component';

describe('AllotmentConfirmationComponent', () => {
  let component: AllotmentConfirmationComponent;
  let fixture: ComponentFixture<AllotmentConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllotmentConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllotmentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

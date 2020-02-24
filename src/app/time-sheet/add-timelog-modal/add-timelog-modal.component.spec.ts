import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelogModalComponent } from './add-timelog-modal.component';

describe('AddTimelogModalComponent', () => {
  let component: AddTimelogModalComponent;
  let fixture: ComponentFixture<AddTimelogModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelogModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

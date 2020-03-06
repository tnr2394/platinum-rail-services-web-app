import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompModalComponent } from './add-comp-modal.component';

describe('AddCompModalComponent', () => {
  let component: AddCompModalComponent;
  let fixture: ComponentFixture<AddCompModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

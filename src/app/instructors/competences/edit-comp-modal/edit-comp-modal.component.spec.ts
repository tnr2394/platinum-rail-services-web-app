import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompModalComponent } from './edit-comp-modal.component';

describe('EditCompModalComponent', () => {
  let component: EditCompModalComponent;
  let fixture: ComponentFixture<EditCompModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

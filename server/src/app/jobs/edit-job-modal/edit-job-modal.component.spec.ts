import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobModalComponent } from './edit-job-modal.component';

describe('EditJobModalComponent', () => {
  let component: EditJobModalComponent;
  let fixture: ComponentFixture<EditJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

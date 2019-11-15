import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientModalComponent } from './edit-client-modal.component';

describe('EditClientModalComponent', () => {
  let component: EditClientModalComponent;
  let fixture: ComponentFixture<EditClientModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClientModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

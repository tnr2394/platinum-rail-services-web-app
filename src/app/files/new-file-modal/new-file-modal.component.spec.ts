import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFileModalComponent } from './new-file-modal.component';

describe('NewFileModalComponent', () => {
  let component: NewFileModalComponent;
  let fixture: ComponentFixture<NewFileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

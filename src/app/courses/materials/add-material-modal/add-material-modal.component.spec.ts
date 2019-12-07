import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialModalComponent } from './add-material-modal.component';

describe('AddMaterialModalComponent', () => {
  let component: AddMaterialModalComponent;
  let fixture: ComponentFixture<AddMaterialModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaterialModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

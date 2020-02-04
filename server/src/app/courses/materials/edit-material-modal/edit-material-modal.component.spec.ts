import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialModalComponent } from './edit-material-modal.component';

describe('EditMaterialModalComponent', () => {
  let component: EditMaterialModalComponent;
  let fixture: ComponentFixture<EditMaterialModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMaterialModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMaterialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

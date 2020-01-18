import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFolderComponent } from './single-folder.component';

describe('SingleFolderComponent', () => {
  let component: SingleFolderComponent;
  let fixture: ComponentFixture<SingleFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

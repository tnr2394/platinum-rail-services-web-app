import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerReadingMaterialComponent } from './learner-reading-material.component';

describe('LearnerReadingMaterialComponent', () => {
  let component: LearnerReadingMaterialComponent;
  let fixture: ComponentFixture<LearnerReadingMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerReadingMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerReadingMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

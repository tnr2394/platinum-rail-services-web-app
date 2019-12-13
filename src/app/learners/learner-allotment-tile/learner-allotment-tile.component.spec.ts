import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerAllotmentTileComponent } from './learner-allotment-tile.component';

describe('LearnerAllotmentTileComponent', () => {
  let component: LearnerAllotmentTileComponent;
  let fixture: ComponentFixture<LearnerAllotmentTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerAllotmentTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerAllotmentTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

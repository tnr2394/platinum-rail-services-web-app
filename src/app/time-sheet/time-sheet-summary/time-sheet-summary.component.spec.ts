import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetSummaryComponent } from './time-sheet-summary.component';

describe('TimeSheetSummaryComponent', () => {
  let component: TimeSheetSummaryComponent;
  let fixture: ComponentFixture<TimeSheetSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

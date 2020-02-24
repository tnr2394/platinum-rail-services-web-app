import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportAComponent } from './admin-report-a.component';

describe('AdminReportAComponent', () => {
  let component: AdminReportAComponent;
  let fixture: ComponentFixture<AdminReportAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReportAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

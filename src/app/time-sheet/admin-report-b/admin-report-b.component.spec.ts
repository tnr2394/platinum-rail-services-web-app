import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportBComponent } from './admin-report-b.component';

describe('AdminReportBComponent', () => {
  let component: AdminReportBComponent;
  let fixture: ComponentFixture<AdminReportBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReportBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

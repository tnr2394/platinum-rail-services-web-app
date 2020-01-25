import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavFixedComponent } from './side-nav-fixed.component';

describe('SideNavFixedComponent', () => {
  let component: SideNavFixedComponent;
  let fixture: ComponentFixture<SideNavFixedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavFixedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InductionPackFormComponent } from './induction-pack-form.component';

describe('InductionPackFormComponent', () => {
  let component: InductionPackFormComponent;
  let fixture: ComponentFixture<InductionPackFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InductionPackFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InductionPackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

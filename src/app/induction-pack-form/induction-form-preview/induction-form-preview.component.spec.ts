import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InductionFormPreviewComponent } from './induction-form-preview.component';

describe('InductionFormPreviewComponent', () => {
  let component: InductionFormPreviewComponent;
  let fixture: ComponentFixture<InductionFormPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InductionFormPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InductionFormPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareFileModalComponent } from './share-file-modal.component';

describe('ShareFileModalComponent', () => {
  let component: ShareFileModalComponent;
  let fixture: ComponentFixture<ShareFileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareFileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

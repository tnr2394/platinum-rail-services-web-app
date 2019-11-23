import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTileComponent } from './material-tile.component';

describe('MaterialTileComponent', () => {
  let component: MaterialTileComponent;
  let fixture: ComponentFixture<MaterialTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

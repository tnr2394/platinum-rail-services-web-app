import { TestBed } from '@angular/core/testing';

import { SideNavServiceService } from './side-nav-service.service';

describe('SideNavServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SideNavServiceService = TestBed.get(SideNavServiceService);
    expect(service).toBeTruthy();
  });
});

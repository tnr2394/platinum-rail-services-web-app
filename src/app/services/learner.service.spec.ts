import { TestBed } from '@angular/core/testing';

import { LearnerService } from './learner.service';

describe('LearnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LearnerService = TestBed.get(LearnerService);
    expect(service).toBeTruthy();
  });
});

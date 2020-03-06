import { TestBed } from '@angular/core/testing';

import { CompetenciesService } from './competencies.service';

describe('CompetenciesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompetenciesService = TestBed.get(CompetenciesService);
    expect(service).toBeTruthy();
  });
});

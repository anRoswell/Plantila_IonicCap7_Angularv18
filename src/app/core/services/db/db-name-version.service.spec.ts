import { TestBed } from '@angular/core/testing';

import { DbNameVersionService } from '../db/db-name-version.service';

describe('DbNameVersionService', () => {
  let service: DbNameVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbNameVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

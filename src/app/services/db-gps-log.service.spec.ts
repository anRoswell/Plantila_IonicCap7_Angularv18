import { TestBed } from '@angular/core/testing';

import { DbGpsLogService } from './db-gps-log.service';

describe('DblocalRegisterGpsService', () => {
  let service: DbGpsLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbGpsLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

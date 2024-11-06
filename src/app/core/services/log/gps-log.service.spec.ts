import { TestBed } from '@angular/core/testing';

import { GpsLogService } from './gps-log.service';

describe('GpsLogService', () => {
  let service: GpsLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GpsLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

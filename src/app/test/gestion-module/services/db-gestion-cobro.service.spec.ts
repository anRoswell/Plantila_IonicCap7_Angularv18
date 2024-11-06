import { TestBed } from '@angular/core/testing';

import { DbGestionCobroService } from './db-gestion-cobro.service';

describe('DbGestionCobroService', () => {
  let service: DbGestionCobroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbGestionCobroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

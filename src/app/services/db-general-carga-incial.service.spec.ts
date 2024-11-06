import { TestBed } from '@angular/core/testing';

import { DbGeneralCargaIncialService } from './db-general-carga-incial.service';

describe('DbGeneralCargaIncialService', () => {
  let service: DbGeneralCargaIncialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbGeneralCargaIncialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

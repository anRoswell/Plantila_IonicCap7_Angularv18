import { TestBed } from '@angular/core/testing';

import { DbpruebaService } from './dbprueba.service';

describe('DbpruebaService', () => {
  let service: DbpruebaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbpruebaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

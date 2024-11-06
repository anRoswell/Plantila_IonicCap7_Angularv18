import { TestBed } from '@angular/core/testing';

import { SqlLiteService } from '../sqllite.service';

describe('SqlliteService', () => {
  let service: SqlLiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlLiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { InitializeFactoryService } from './initialize-factory.service';

describe('InitializeFactoryService', () => {
  let service: InitializeFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitializeFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

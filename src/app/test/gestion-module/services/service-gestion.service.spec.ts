import { TestBed } from '@angular/core/testing';

import { ServiceGestionService } from './service-gestion.service';

describe('ServiceGestionService', () => {
  let service: ServiceGestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceGestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

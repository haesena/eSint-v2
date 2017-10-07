import { TestBed, inject } from '@angular/core/testing';

import { GiftsService } from './gifts.service';

describe('GiftsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GiftsService]
    });
  });

  it('should be created', inject([GiftsService], (service: GiftsService) => {
    expect(service).toBeTruthy();
  }));
});

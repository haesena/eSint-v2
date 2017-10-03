import { TestBed, inject } from '@angular/core/testing';

import { WishlistsService } from './wishlists.service';

describe('WishlistsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WishlistsService]
    });
  });

  it('should be created', inject([WishlistsService], (service: WishlistsService) => {
    expect(service).toBeTruthy();
  }));
});

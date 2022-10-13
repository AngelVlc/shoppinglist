import { TestBed } from '@angular/core/testing';

import { IonicGestureConfig } from './ionic-gesture-config';

describe('IonicGestureConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IonicGestureConfig = TestBed.inject(IonicGestureConfig);
    expect(service).toBeTruthy();
  });
});

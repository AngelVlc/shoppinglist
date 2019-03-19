import { TestBed } from '@angular/core/testing';

import { IonicGestureConfig } from './ionic-gesture-config';

describe('IonicGestureConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IonicGestureConfig = TestBed.get(IonicGestureConfig);
    expect(service).toBeTruthy();
  });
});

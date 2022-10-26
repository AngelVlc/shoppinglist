import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Storage } from '@ionic/storage-angular';

describe('AppComponent', () => {
  let storageSpyObj: jasmine.SpyObj<Storage>;

  beforeEach(waitForAsync(() => {
    const storageSpy = jasmine.createSpyObj('Storage', ['create']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Storage, useValue: storageSpy }
      ]
    })
    
    storageSpyObj = TestBed.get(Storage);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
    expect(storageSpyObj.create).toHaveBeenCalled();
  });
});

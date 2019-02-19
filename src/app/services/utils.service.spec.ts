import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { AlertController, LoadingController } from '@ionic/angular';

describe('UtilsService', () => {
  let utilsService: UtilsService;
  let alertCtrlSpyObj: jasmine.SpyObj<AlertController>;
  let loadingCtrlSpyObj: jasmine.SpyObj<LoadingController>;


  beforeEach(() => {
    const alertCtrlSpy = jasmine.createSpyObj('AlertController', ['componentOnReady', 'create']);
    const loadingCtrlSpy = jasmine.createSpyObj('LoadingController', ['componentOnReady', 'create']);

    TestBed.configureTestingModule({
      providers: [
        UtilsService,
        { provide: AlertController, useValue: alertCtrlSpy },
        { provide: LoadingController, useValue: loadingCtrlSpy }
      ]
    });

    utilsService = TestBed.get(UtilsService);
    alertCtrlSpyObj = TestBed.get(AlertController);
    loadingCtrlSpyObj = TestBed.get(LoadingController);
  });

  it('should be created', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service).toBeTruthy();
  });

  it('showAlert() should show an alert', async () => {
    const alertSpyObj = jasmine.createSpyObj('Alert', ['present']);
    alertCtrlSpyObj.create.and.returnValue(alertSpyObj);
    await utilsService.showAlert('title', 'message');
    expect(alertCtrlSpyObj.create.calls.count()).toEqual(1);
    expect(alertCtrlSpyObj.create).toHaveBeenCalledWith({
      header: 'title',
      message: 'message',
      buttons: ['OK']
    });
    expect(alertSpyObj.present.calls.count()).toEqual(1);
  });

  it('showLoading() should show a loading', async () => {
    const loadingSpyObj = jasmine.createSpyObj('Loading', ['present']);
    loadingCtrlSpyObj.create.and.returnValue(loadingSpyObj);
    const result = await utilsService.showLoading('message');
    expect(loadingCtrlSpyObj.create.calls.count()).toEqual(1);
    expect(loadingCtrlSpyObj.create).toHaveBeenCalledWith({
      message: 'message',
    });
    expect(loadingSpyObj.present.calls.count()).toEqual(1);
    expect(result).toBe(loadingSpyObj);
  });
});

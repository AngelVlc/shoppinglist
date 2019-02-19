import { TestBed } from '@angular/core/testing';

import { ItemsService } from './items.service';
import { Storage } from '@ionic/storage';
import { Item } from 'src/models/item';
import { UtilsService } from './utils.service';
import { Components } from '@ionic/core';

describe('ItemsService', () => {
  let itemsService: ItemsService;
  let storageSpyObj: jasmine.SpyObj<Storage>;
  let utilsSrvSpyObj: jasmine.SpyObj<UtilsService>;
  let loadingSpyObj: jasmine.SpyObj<Components.IonLoading>;
  let items: Item[];

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);
    const utilsSrvSpy = jasmine.createSpyObj('UtilsService', ['showLoading', 'showAlert']);

    TestBed.configureTestingModule({
      providers: [
        ItemsService,
        { provide: Storage, useValue: storageSpy },
        { provide: UtilsService, useValue: utilsSrvSpy}
      ]
    });

    itemsService = TestBed.get(ItemsService);
    storageSpyObj = TestBed.get(Storage);
    utilsSrvSpyObj = TestBed.get(UtilsService);
    loadingSpyObj = jasmine.createSpyObj('Loading', ['dismiss']);
    utilsSrvSpyObj.showLoading.and.returnValue(loadingSpyObj);

    const item1 = new Item();
    item1.name = 'item1';
    const item2 = new Item();
    item2.name = 'item2';
    items = [item1, item2];
  });

  it('should be created', () => {
    expect(itemsService).toBeTruthy();
  });

  it('loadItems() should show a loading', async () => {
    await itemsService.loadItems();
    expect(utilsSrvSpyObj.showLoading.calls.count()).toEqual(1);
    expect(utilsSrvSpyObj.showLoading).toHaveBeenCalledWith('Cargando ...');
  });

  it('loadItems() should return items stored in storage', async () => {
    storageSpyObj.get.and.returnValue(items);
    const result = await itemsService.loadItems();
    expect(loadingSpyObj.dismiss.calls.count()).toEqual(1);
    expect(storageSpyObj.get.calls.count()).toEqual(1);
    expect(storageSpyObj.get).toHaveBeenCalledWith('items');
    expect(result).toEqual(items);
  });

  it('loadItems() should return an empty array if there are not items in the storage', async () => {
    storageSpyObj.get.and.returnValue(null);
    const result = await itemsService.loadItems();
    expect(loadingSpyObj.dismiss.calls.count()).toEqual(1);
    expect(storageSpyObj.get.calls.count()).toEqual(1);
    expect(storageSpyObj.get).toHaveBeenCalledWith('items');
    expect(result).toEqual([]);
  });

  it('loadItems() should show an alert if the call to storage fails', async () => {
    storageSpyObj.get.and.throwError('error');
    await itemsService.loadItems();
    expect(loadingSpyObj.dismiss.calls.count()).toEqual(1);
    expect(utilsSrvSpyObj.showAlert.calls.count()).toEqual(1);
    expect(utilsSrvSpyObj.showAlert).toHaveBeenCalledWith('Error al leer del storage', 'error');
  });

  it('saveItems() should show a loading', async () => {
    await itemsService.saveItems(items);
    expect(utilsSrvSpyObj.showLoading.calls.count()).toEqual(1);
    expect(utilsSrvSpyObj.showLoading).toHaveBeenCalledWith('Guardando ...');
  });

  it('saveItems() should save items in storage', async () => {
    await itemsService.saveItems(items);
    expect(loadingSpyObj.dismiss.calls.count()).toEqual(1);
    expect(storageSpyObj.set.calls.count()).toEqual(1);
    expect(storageSpyObj.set).toHaveBeenCalledWith('items', items);
  });

  it('saveItems() should show an alert if the call to storage fails', async () => {
    storageSpyObj.set.and.throwError('error');
    await itemsService.saveItems(items);
    expect(loadingSpyObj.dismiss.calls.count()).toEqual(1);
    expect(utilsSrvSpyObj.showAlert.calls.count()).toEqual(1);
    expect(utilsSrvSpyObj.showAlert).toHaveBeenCalledWith('Error al guardar en el storage', 'error');
  });

});

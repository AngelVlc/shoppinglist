import { DebugElement } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HomePage } from './home.page';

import { ModalController } from '@ionic/angular';
import { ItemsService } from '../services/items.service';
import { Item } from 'src/models/item';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let modalCtrlSpyObj: jasmine.SpyObj<ModalController>;
  let itemsSrvSpyObj: jasmine.SpyObj<ItemsService>;
  let existingItems: Item[];

  function createComponent(items: Item[]) {
    const itemsPromise = new Promise((resolve, reject) => {
      resolve(items);
    });
    itemsSrvSpyObj.loadItems.and.returnValue(itemsPromise);
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function getAddButtonElement(): DebugElement {
    return fixture.debugElement.query(By.css('#addBtn'));
  }

  beforeEach(async(() => {
    const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    const itemsSrvSpy = jasmine.createSpyObj('ItemsService', ['loadItems', 'saveItems']);

    TestBed.configureTestingModule({
      declarations: [HomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: ItemsService, useValue: itemsSrvSpy }
      ]
    })
      .compileComponents();

    modalCtrlSpyObj = TestBed.get(ModalController);
    itemsSrvSpyObj = TestBed.get(ItemsService);

    const item1 = new Item();
    item1.Name = 'item1';
    const item2 = new Item();
    item2.Name = 'item2';
    existingItems = [item1, item2];
  }));

  it('should create component wiht no items', () => {
    createComponent([]);
    expect(component).toBeTruthy();
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const foundItems = fixture.debugElement.queryAll(By.css('ion-item'));
      expect(foundItems.length).toEqual(0);
    });
  });

  it('should create component wiht items', async () => {
    createComponent(existingItems);
    expect(component).toBeTruthy();
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const foundItems = fixture.debugElement.queryAll(By.css('ion-item'));
      expect(foundItems.length).toEqual(existingItems.length);
    });
  });

  it('add btn click should open the modal', async () => {
    createComponent(existingItems);
    const spy = spyOn<any>(component, 'openModal');
    spy.and.callFake((index) => {
      expect(index).toEqual(-1);
    });
    getAddButtonElement().triggerEventHandler('click', null);
  });

  it('item click shoul open the modal', async () => {
    createComponent(existingItems);
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const foundItems = fixture.debugElement.queryAll(By.css('ion-item'));
      const lastItem = foundItems[foundItems.length - 1];
      const spy = spyOn<any>(component, 'openModal');
      spy.and.callFake((index) => {
        expect(index).toEqual(foundItems.length - 1);
      });
      lastItem.triggerEventHandler('click', null);
    });
  });

  it('getItemLabel() method should add +info to the item name if it is important', async () => {
    const item: Item = {
      Name: 'wadus',
      Important: false,
      Remarks: null
    };
    expect(component.getItemLabel(item)).toEqual('wadus');

    const importantItem: Item = {
      Name: 'wadus',
      Important: true,
      Remarks: null
    };
    expect(component.getItemLabel(item)).toEqual('wadus');
  });
});

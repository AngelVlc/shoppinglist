import { DebugElement } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HomePage } from './home.page';

import { ModalController } from '@ionic/angular';
import { ItemsService } from '../services/items.service';
import { Item } from 'src/models/item';
import { ItemPage } from '../item/item.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let modalCtrlSpyObj: jasmine.SpyObj<ModalController>;
  let itemsSrvSpyObj: jasmine.SpyObj<ItemsService>;
  let existingItems: Item[];

  function createComponent(items: Item[]) {
    itemsSrvSpyObj.loadItems.and.returnValue(Promise.resolve(items));
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function getAddButtonElement(): DebugElement {
    return fixture.debugElement.query(By.css('#addBtn'));
  }

  beforeEach(async(() => {
    const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss', 'create']);
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

  it('item click should open the modal', async () => {
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

  it('getItemLabel() method should add +info to the item name if it has remarks', async () => {
    const item: Item = {
      Name: 'wadus',
      Important: false,
      Remarks: null
    };
    expect(component.getItemLabel(item)).toEqual('wadus');

    const itemsWithRemarks: Item = {
      Name: 'wadus',
      Important: true,
      Remarks: 'remarks'
    };
    expect(component.getItemLabel(itemsWithRemarks)).toEqual('wadus (+info)');
  });

  it('ion reorder group should have disabled = false', async () => {
    createComponent(existingItems);
    const reorderGroup = fixture.debugElement.query(By.css('#reorderGroup'));
    expect(reorderGroup.attributes['disabled']).toEqual('false');
  });

  describe('openModal()', () => {
    it('should present the modal', async () => {
      createComponent(existingItems);
      fixture.whenRenderingDone().then(async () => {
        const modalSpyObj = jasmine.createSpyObj('ItemPage', ['present', 'onDidDismiss']);
        modalCtrlSpyObj.create.and.returnValue(modalSpyObj);
        modalSpyObj.onDidDismiss.and.returnValue(Promise.resolve({}));
        await (component as any).openModal(1);
        expect(modalCtrlSpyObj.create).toHaveBeenCalledWith({
          component: ItemPage,
          componentProps: {
            index: 1,
            item: { ...existingItems[1] }
          }
        });
        expect(modalSpyObj.present.calls.count()).toEqual(1);
      });
    });

    describe('and process the dismiss with a new item', () => {
      it('when the user cancels the modal', async () => {
        createComponent(existingItems);
        const itemsCount = existingItems.length;
        fixture.whenRenderingDone().then(async () => {
          const detail = {
            data: null
          };
          await (component as any).onModalDismiss(detail);
          expect(component.items.length).toBe(itemsCount);
          expect(itemsSrvSpyObj.saveItems).not.toHaveBeenCalled();
        });
      });

      it('when the user accepts the modal', async () => {
        createComponent(existingItems);
        const itemsCount = existingItems.length;
        fixture.whenRenderingDone().then(async () => {
          const newItem: Item = {
            Name: 'new item',
            Important: true,
            Remarks: 'the remarks'
          };
          const detail = {
            data: {
              item: newItem,
              index: -1
            }
          };
          await (component as any).onModalDismiss(detail);
          expect(component.items.length).toBe(itemsCount + 1);
          expect(component.items[component.items.length - 1].Name).toEqual(newItem.Name);
          expect(component.items[component.items.length - 1].Important).toEqual(newItem.Important);
          expect(component.items[component.items.length - 1].Remarks).toEqual(newItem.Remarks);
          expect(itemsSrvSpyObj.saveItems).toHaveBeenCalled();
        });
      });
    });

    describe('and process the dismiss with an existing item', () => {
      it('when the user deletes an existing item', async () => {
        createComponent(existingItems);
        const itemsCount = existingItems.length;
        fixture.whenRenderingDone().then(async () => {
          const detail = {
            data: {
              item: null,
              index: 0
            }
          };
          await (component as any).onModalDismiss(detail);
          expect(component.items.length).toBe(itemsCount - 1);
          expect(itemsSrvSpyObj.saveItems).toHaveBeenCalled();
        });
      });

      it('when the user cancels the modal', async () => {
        createComponent(existingItems);
        const itemsCount = existingItems.length;
        fixture.whenRenderingDone().then(async () => {
          const detail = {
            data: null
          };
          await (component as any).onModalDismiss(detail);
          expect(component.items.length).toBe(itemsCount);
          expect(itemsSrvSpyObj.saveItems).not.toHaveBeenCalled();
        });
      });

      it('when the user accepts the modal', async () => {
        createComponent(existingItems);
        const itemsCount = existingItems.length;
        fixture.whenRenderingDone().then(async () => {
          const modifiedItem = { ...existingItems[0] };
          const detail = {
            data: {
              item: modifiedItem,
              index: 0
            }
          };
          await (component as any).onModalDismiss(detail);
          expect(component.items.length).toBe(itemsCount);
          expect(component.items[0].Name).toEqual(modifiedItem.Name);
          expect(component.items[0].Important).toEqual(modifiedItem.Important);
          expect(component.items[0].Remarks).toEqual(modifiedItem.Remarks);
          expect(itemsSrvSpyObj.saveItems).toHaveBeenCalled();
        });
      });
    });
  });
});

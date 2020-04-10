import { DebugElement } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By, HAMMER_LOADER } from '@angular/platform-browser';

import { HomePage } from './home.page';

import { ModalController } from '@ionic/angular';
import { ItemsService } from '../services/items.service';
import { Item } from 'src/app/models/item';
import { ItemPage } from '../item/item.page';

import 'hammerjs';

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
    return fixture.debugElement.query(By.css('[data-test-id="addBtn"]'));
  }

  beforeEach(async(() => {
    const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss', 'create']);
    const itemsSrvSpy = jasmine.createSpyObj('ItemsService', ['loadItems', 'saveItems']);

    TestBed.configureTestingModule({
      declarations: [HomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: ItemsService, useValue: itemsSrvSpy },
        { provide: HAMMER_LOADER, useValue: HAMMER_LOADER },
      ]
    })
      .compileComponents();

    modalCtrlSpyObj = TestBed.get(ModalController);
    itemsSrvSpyObj = TestBed.get(ItemsService);

    const item1 = new Item();
    item1.name = 'item1';
    const item2 = new Item();
    item2.name = 'item2';
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

  it('should create component with items', async () => {
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
    expect(spy.calls.count()).toBe(1);
  });

  it('item tap should open the modal', async () => {
    createComponent(existingItems);
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const foundItems = fixture.debugElement.queryAll(By.css('ion-item'));
      const lastItem = foundItems[foundItems.length - 1];
      const spy = spyOn<any>(component, 'openModal');
      spy.and.callFake((index) => {
        expect(index).toEqual(foundItems.length - 1);
      });
      lastItem.triggerEventHandler('tap', null);
      expect(spy.calls.count()).toBe(1);
    });
  });

  it('item press should mark it as selected', async () => {
    createComponent(existingItems);
    fixture.whenRenderingDone().then(() => {
      fixture.detectChanges();
      const foundItems = fixture.debugElement.queryAll(By.css('ion-item'));
      const lastItem = foundItems[foundItems.length - 1];
      const spy = spyOn<any>(component, 'onItemPressed');
      spy.and.callFake((item) => {
        expect(item).toEqual(existingItems[existingItems.length - 1]);
      });
      lastItem.triggerEventHandler('press', null);
      expect(spy.calls.count()).toBe(1);
    });
  });

  it('getItemLabel() method should show the item name if it does not have remarks and its quantity is 1', async () => {
    const item: Item = {
      name: 'wadus',
      important: false,
      remarks: null,
      quantity: 1
    };
    expect(component.getItemLabel(item)).toEqual('wadus');
  });

  it('getItemLabel() method should add +info to the item name if it has remarks', async () => {
    const itemsWithRemarks: Item = {
      name: 'wadus',
      important: true,
      remarks: 'remarks',
      quantity: 1
    };
    expect(component.getItemLabel(itemsWithRemarks)).toEqual('wadus (+info)');
  });

  it('getItemLabel() method should add the quantity when it is greater than 1', async () => {
    const item: Item = {
      name: 'wadus',
      important: true,
      remarks: null,
      quantity: 5
    };
    expect(component.getItemLabel(item)).toEqual('5x wadus');
  });

  it('ion reorder group should have disabled = false', async () => {
    createComponent(existingItems);
    const reorderGroup = fixture.debugElement.query(By.css('[data-test-id="reorderGroup"]'));
    expect(reorderGroup.attributes['disabled']).toEqual('false');
  });

  it('onItemPressed() should change the selected value of a component depending on its previous selected value', async () => {
    const item = new Item();
    component.onItemPressed(item);
    expect(component.selectedItems.length).toEqual(1);
    component.onItemPressed(item);
    expect(component.selectedItems.length).toEqual(0);
  });

  it('showDeleteButton() should return true if some item is selected and false when no one is selected', async () => {
    createComponent(existingItems);
    fixture.whenRenderingDone().then(async () => {
      expect(component.showDeleteButton()).toEqual(false);
      component.selectedItems.push(component.items[0]);
      expect(component.showDeleteButton()).toEqual(true);
    });
  });

  it('onDeleteSelectedButtonClicked() should remove the selected items', async () => {
    const items = [...existingItems];
    const originalLength = items.length;
    const firstItemName = items[0].name;
    createComponent(existingItems);
    fixture.whenRenderingDone().then(async () => {
      component.selectedItems.push(component.items[0]);
      component.onDeleteSelectedButtonClicked();
      expect(component.items.length).toEqual(originalLength - 1);
      expect(component.items[0].name).not.toEqual(firstItemName);
      expect(itemsSrvSpyObj.saveItems).toHaveBeenCalled();
      expect(component.selectedItems.length).toEqual(0);
    });
  });

  it('isSelectedItem() should return true if the item is selected', async() => {
    createComponent(existingItems);
    fixture.whenRenderingDone().then(async () => {
      expect(component.isSelectedItem(component.items[0])).toBe(false);
      component.selectedItems.push(component.items[0]);
      expect(component.isSelectedItem(component.items[0])).toBe(true);
    });
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
            name: 'new item',
            important: true,
            remarks: 'the remarks',
            quantity: 5
          };
          const detail = {
            data: {
              item: newItem,
              index: -1
            }
          };
          await (component as any).onModalDismiss(detail);
          expect(component.items.length).toBe(itemsCount + 1);
          const lastItem = component.items[component.items.length - 1];
          expect(lastItem.name).toEqual(newItem.name);
          expect(lastItem.important).toEqual(newItem.important);
          expect(lastItem.remarks).toEqual(newItem.remarks);
          expect(lastItem.quantity).toEqual(newItem.quantity);
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
          modifiedItem.name = 'modified';
          modifiedItem.quantity += 1;
          const detail = {
            data: {
              item: modifiedItem,
              index: 0
            }
          };
          await (component as any).onModalDismiss(detail);
          expect(component.items.length).toBe(itemsCount);
          const item = component.items[0];
          expect(item.name).toEqual(modifiedItem.name);
          expect(item.important).toEqual(modifiedItem.important);
          expect(item.remarks).toEqual(modifiedItem.remarks);
          expect(item.quantity).toEqual(modifiedItem.quantity);
          expect(itemsSrvSpyObj.saveItems).toHaveBeenCalled();
        });
      });
    });
  });
});

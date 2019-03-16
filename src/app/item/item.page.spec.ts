import { DebugElement } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ItemPage } from './item.page';

import { ModalController, NavParams } from '@ionic/angular';
import { Item } from 'src/models/item';

describe('ItemPage', () => {
  let component: ItemPage;
  let fixture: ComponentFixture<ItemPage>;
  let modalCtrlSpyObj: jasmine.SpyObj<ModalController>;
  let navParamsSpyObj: jasmine.SpyObj<NavParams>;
  const existingItem: Item = {
    name: 'wadus',
    important: true,
    remarks: 'these are the remarks'
  };

  function createComponent(params) {
    navParamsSpyObj.get.and.callFake((myParam) => {
      return params[myParam];
    });

    fixture = TestBed.createComponent(ItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function createComponentWithExistingItem() {
    const params = {
      'item': existingItem,
      'index': 1
    };

    createComponent(params);
  }

  function createComponentWithNewItem() {
    const item = new Item();
    const params = {
      'item': item,
      'index': -1
    };

    createComponent(params);
  }

  function getPageElement(): HTMLElement {
    const debugElement: DebugElement = fixture.debugElement;
    return debugElement.nativeElement;
  }

  function getTitleText(): string {
    return getPageElement().querySelector('ion-header ion-toolbar ion-title').textContent;
  }

  function getFirstButtonText(): string {
    return getPageElement().querySelectorAll('ion-footer ion-buttons ion-button')[0].textContent;
  }

  function getNameInputValue(): string {
    return fixture.debugElement.query(By.css('[data-test-id="name"]')).properties.ngModel;
  }

  function getRemarksInputValue(): string {
    return fixture.debugElement.query(By.css('[data-test-id="remarks"]')).properties.ngModel;
  }

  function getImportantInputValue(): boolean {
    return fixture.debugElement.query(By.css('[data-test-id="important"]')).properties.ngModel;
  }

  function getDeleteButtonElement(): DebugElement {
    return fixture.debugElement.query(By.css('[data-test-id="deleteBtn"]'));
  }

  beforeEach(async(() => {
    const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    const navParamsSpy = jasmine.createSpyObj('NavParams', ['get']);

    TestBed.configureTestingModule({
      declarations: [ItemPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: NavParams, useValue: navParamsSpy }
      ]
    })
      .compileComponents();

    modalCtrlSpyObj = TestBed.get(ModalController);
    navParamsSpyObj = TestBed.get(NavParams);
  }));

  it('should create the component for an existing item', () => {
    createComponentWithExistingItem();
    expect(component).toBeTruthy();
    expect(getTitleText()).toEqual('Ver artículo');
    expect(getFirstButtonText()).toEqual('Guardar');
    expect(getNameInputValue()).toEqual(existingItem.name);
    expect(getRemarksInputValue()).toEqual(existingItem.remarks);
    expect(getImportantInputValue()).toEqual(existingItem.important);
    expect(getDeleteButtonElement()).not.toBeNull();
  });

  it('should create the component for a new item', () => {
    createComponentWithNewItem();
    expect(component).toBeTruthy();
    expect(getTitleText()).toEqual('Nuevo artículo');
    expect(getFirstButtonText()).toEqual('Añadir');
    expect(getNameInputValue()).toBeNull();
    expect(getRemarksInputValue()).toBeNull();
    expect(getImportantInputValue()).toEqual(false);
    expect(getDeleteButtonElement()).toBeNull();
  });

  it('delete button click should dismiss the modal', () => {
    createComponentWithExistingItem();
    const deleteBtn = getDeleteButtonElement();
    deleteBtn.triggerEventHandler('click', null);
    expect(modalCtrlSpyObj.dismiss.calls.count()).toEqual(1);
    const data = {
      item: null,
      index: 1
    };
    expect(modalCtrlSpyObj.dismiss).toHaveBeenCalledWith(data);
  });

  it('cancel button click when the item exists should dismiss the modal', () => {
    createComponentWithExistingItem();
    const cancelButton = fixture.debugElement.query(By.css('[data-test-id="cancelBtn"]'));
    cancelButton.triggerEventHandler('click', null);
    expect(modalCtrlSpyObj.dismiss).toHaveBeenCalledWith(null);
  });

  it('ok button click when the item exists should dismiss the modal', () => {
    createComponentWithExistingItem();
    const cancelButton = fixture.debugElement.query(By.css('[data-test-id="okBtn"]'));
    cancelButton.triggerEventHandler('click', null);
    const data = {
      item: existingItem,
      index: 1
    };
    expect(modalCtrlSpyObj.dismiss).toHaveBeenCalledWith(data);
  });

  it('cancel button click when the item is new should dismiss the modal', () => {
    createComponentWithNewItem();
    const cancelButton = fixture.debugElement.query(By.css('[data-test-id="cancelBtn"]'));
    cancelButton.triggerEventHandler('click', null);
    expect(modalCtrlSpyObj.dismiss).toHaveBeenCalledWith(null);
  });

  it('ok button click when the item is new should dismiss the modal', () => {
    createComponentWithNewItem();
    const cancelButton = fixture.debugElement.query(By.css('[data-test-id="okBtn"]'));
    cancelButton.triggerEventHandler('click', null);
    const data = {
      item: (component as any).item,
      index: -1
    };
    expect(modalCtrlSpyObj.dismiss).toHaveBeenCalledWith(data);
  });
});

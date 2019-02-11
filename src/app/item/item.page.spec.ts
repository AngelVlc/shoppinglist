import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPage } from './item.page';

import { ModalController, NavParams } from '@ionic/angular';
import { Item } from 'src/models/item';

describe('ItemPage', () => {
  let component: ItemPage;
  let fixture: ComponentFixture<ItemPage>;
  let modalCtrlSpyObj: jasmine.SpyObj<ModalController>;
  let navParamsSpyObj: jasmine.SpyObj<NavParams>;

  beforeEach(async(() => {
    const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    const navParamsSpy = jasmine.createSpyObj('NavParams', ['get']);

    TestBed.configureTestingModule({
      declarations: [ ItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers : [
        { provide: ModalController, useValue: modalCtrlSpy },
        { provide: NavParams, useValue: navParamsSpy }
      ]
    })
    .compileComponents();

    modalCtrlSpyObj = TestBed.get(ModalController);
    navParamsSpyObj = TestBed.get(NavParams);
    const item = new Item();
    item.Name = 'wadus';
    const params = {
      'item': item,
      'index': 1
    };
    navParamsSpyObj.get.and.callFake((myParam) => {
      return params[myParam];
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

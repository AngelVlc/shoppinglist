import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';

import { ModalController } from '@ionic/angular';
import { ItemsService } from '../services/items.service';
import { Item } from 'src/models/item';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let modalCtrlSpyObj: jasmine.SpyObj<ModalController>;
  let itemsSrvSpyObj: jasmine.SpyObj<ItemsService>;

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
    const items = [item1, item2];

    const itemsPromise = new Promise((resolve, reject) => {
      resolve(items);
    });
    itemsSrvSpyObj.loadItems.and.returnValue(itemsPromise);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

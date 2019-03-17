import { Component } from '@angular/core';
import { Item } from 'src/models/item';
import { ItemsService } from '../services/items.service';
import { ModalController } from '@ionic/angular';
import { ItemPage } from '../item/item.page';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: Item[] = [];
  selectedItems: Item[] = [];

  constructor(private itemsSrv: ItemsService
    , private modalCrtl: ModalController) {

    this.itemsSrv.loadItems().then((data) => {
      this.items = data;
    });
  }

  async onAddButtonClicked() {
    await this.openModal(-1);
  }

  async onItemTapped(index: number) {
    await this.openModal(index);
  }

  private async openModal(index: number) {
    const props = {
      index: index,
      item: new Item()
    };

    if (index >= 0) {
      props.item = { ...this.items[index] };
    }

    const modal = await this.modalCrtl.create({
      component: ItemPage,
      componentProps: props
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      this.onModalDismiss(detail);
    });

    await modal.present();
  }

  getItemLabel(item) {
    let result = item.name;
    if (item.remarks) {
      result += ' (+info)';
    }
    return result;
  }

  async onItemMoved(e) {
    await this.itemsSrv.saveItems(this.items);
    this.items = e.detail.complete(this.items);
  }

  private async onModalDismiss(detail: OverlayEventDetail) {
    if (!detail.data) {
      return;
    }

    const itemFromModal = detail.data.item;
    const index = detail.data.index;

    if (index < 0) {
      this.items.push(itemFromModal);
    } else {
      if (itemFromModal) {
        this.items[index] = { ...itemFromModal };
      } else {
        this.items.splice(index, 1);
      }
    }

    await this.itemsSrv.saveItems(this.items);
  }

  onItemPressed(item) {
    const foundIndex = this.indexOfSelectedItem(item);
    if (foundIndex >= 0) {
      this.selectedItems.splice(foundIndex, 1);
    } else {
      this.selectedItems.push(item);
    }
  }

  showDeleteButton() {
    return this.selectedItems.length > 0;
  }

  async onDeleteSelectedButtonClicked() {
    this.selectedItems.forEach(item => {
      this.items.splice(this.items.indexOf(item), 1);
    });

    this.selectedItems = [];

    await this.itemsSrv.saveItems(this.items);
  }

  isSelectedItem(item) {
    return this.indexOfSelectedItem(item) >= 0;
  }

  private indexOfSelectedItem(item) {
    return this.selectedItems.indexOf(item);
  }
}

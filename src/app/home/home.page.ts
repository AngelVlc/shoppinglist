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

  constructor(private itemsSrv: ItemsService
    , private modalCrtl: ModalController) {

    this.itemsSrv.loadItems().then((data) => {
      this.items = data;
    });
  }

  addItem() {
    this.openModal(-1);
  }

  async itemClick(index: number) {
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
      if (!detail.data) {
        return;
      }

      const itemFromModal = detail.data.item;

      if (index < 0) {
        this.items.push(itemFromModal);
      } else {
        if (itemFromModal) {
          this.items[index] = { ...itemFromModal };
        } else {
          this.items.splice(index, 1);
        }
      }

      this.itemsSrv.saveItems(this.items);
    });

    await modal.present();
  }

  getItemLabel(item) {
    let result = item.Name;
    if (item.Remarks) {
      result += ' (+info)';
    }
    return result;
  }

  async itemMoved(e) {
    await this.itemsSrv.saveItems(this.items);
    this.items = e.detail.complete(this.items);
  }

}

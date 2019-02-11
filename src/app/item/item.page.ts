import { Component } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Item } from 'src/models/item';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage {

  private item: Item;
  private index: number;

  private title: string;

  private buttonText: string;

  constructor(private navParams: NavParams
    , private modalController: ModalController) {

    this.item = this.navParams.get('item');
    this.index = this.navParams.get('index');

    this.title = 'Ver artículo';
    this.buttonText = 'Guardar';
    if (this.index < 0) {
      this.title = 'Nuevo artículo';
      this.buttonText = 'Añadir';
    }
  }

  async cancel() {
    await this.modalController.dismiss(null);
  }

  async ok() {
    const data = {
      item: this.item,
      index: this.index
    };
    await this.modalController.dismiss(data);
  }

  async delete() {
    const data = {
      item: null,
      index: this.index
    };
    await this.modalController.dismiss(data);
  }
}

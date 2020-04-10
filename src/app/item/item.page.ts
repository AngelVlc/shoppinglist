import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  item: Item;
  index: number;
  title: string;
  okBtnText: string;

  constructor(navParams: NavParams
    , private modalController: ModalController) {

    this.item = navParams.get('item');
    this.index = navParams.get('index');
  }

  ngOnInit() {
    this.title = 'Ver artículo';
    this.okBtnText = 'Guardar';
    if (this.index < 0) {
      this.title = 'Nuevo artículo';
      this.okBtnText = 'Añadir';
    }
  }

  async onCancelButtonClicked() {
    await this.modalController.dismiss(null);
  }

  async onOkButtonClicked() {
    const data = {
      item: this.item,
      index: this.index
    };
    await this.modalController.dismiss(data);
  }

  async onDeleteButtonClicked() {
    const data = {
      item: null,
      index: this.index
    };
    await this.modalController.dismiss(data);
  }
}

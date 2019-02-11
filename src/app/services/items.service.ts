import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UtilsService } from './utils.service';
import { Item } from 'src/models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  storageKey = 'items';

  constructor(private storage: Storage
    , private utilsSrv: UtilsService) { }

  async loadItems(): Promise<Item[]> {
    const loading = await this.utilsSrv.showLoading('Cargando ...');

    try {
      const data = await this.storage.get(this.storageKey);
      await loading.dismiss();
      return data;
    } catch (error) {
      await loading.dismiss();
      this.utilsSrv.showAlert('Error al leer del storage', error.message);
    }
  }

  async saveItems(items: Item[]) {
    const loading = await this.utilsSrv.showLoading('Guardando ...');

    try {
      await this.storage.set(this.storageKey, items);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      this.utilsSrv.showAlert('Error al guardar en el storage', error.message);
    }
  }
}

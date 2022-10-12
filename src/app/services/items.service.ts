import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UtilsService } from './utils.service';
import { Item } from 'src/app/models/item';

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
      let data = await this.storage.get(this.storageKey);
      if (!data) {
        data = [];
      }
      return data;
    } catch (error) {
      this.utilsSrv.showAlert('Error al leer del storage', error.message);
    } finally {
      await loading.dismiss();
    }
  }

  async saveItems(items: Item[]) {
    const loading = await this.utilsSrv.showLoading('Guardando ...');

    try {
      await this.storage.set(this.storageKey, items);
    } catch (error) {
      this.utilsSrv.showAlert('Error al guardar en el storage', error.message);
    } finally {
      await loading.dismiss();
    }
  }
}

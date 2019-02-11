import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Components } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private loadingCtrl: LoadingController
    , private alertCtrl: AlertController) { }

  async showLoading(message: string): Promise<Components.IonLoading> {
    const loadingElement = await this.loadingCtrl.create({ message: message });
    await loadingElement.present();
    return loadingElement;
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

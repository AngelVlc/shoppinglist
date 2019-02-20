import { browser, by, element, protractor } from 'protractor';
// import * as $ from "jquery"

export class AppPage {

  addButton = '#addBtn';


  navigateTo() {
    return browser.get('/');
  }

  getElementById(id: string) {
    return element(by.id(id));
  }

  getAddBtn() {
    return element(by.id('addBtn'));
  }

  waitForAddBtn() {
    let addBtn = this.getOkBtn();
    return browser.wait(protractor.ExpectedConditions.elementToBeClickable(element(by.id('addBtn'))));
  }

  getNameField() {
    return element(by.css('#name input'));
  }

  getRemarksField() {
    return element(by.css('#remarks textarea'));
  }

  getImportantField() {
    return element(by.css('#important'));
  }

  getOkBtn() {
    return element(by.id('okBtn'));
  }

  async getItems() {
    return element.all(by.css('ion-item'));
  }
}

import { BasePage } from "./base.po";
import { ItemPage } from "./item.po";
import { browser, ElementFinder, ElementArrayFinder, by } from "protractor";

export class HomePage extends BasePage {

  private addButton = 'addBtn';
  private title = 'homeTitle';
  private itemPage = new ItemPage();
  private _importantItemColor = 'rgba(240, 65, 65, 1)';
  private _normalItemColor = 'rgba(0, 0, 0, 1)';

  public get importantItemColor(): string {
    return this._importantItemColor;
  }

  public get normalItemColor(): string {
    return this._normalItemColor;
  }

  navigateTo() {
    return browser.get('/');
  }

  removeStorage() {
    return browser.executeScript('window.indexedDB.deleteDatabase("_ionicstorage")');
  }

  clickAddButton() {
    const addButton = this.getElementByTestId(this.addButton);
    return this.clickButton(addButton);
  }

  async addItem(name: string, important: boolean, remarks: string) {
    await this.clickAddButton();
    await this.itemPage.fillFields(name, important, remarks);
    await this.itemPage.clickOkButton();
    return this.waitVisible();
  }

  getItems(): ElementArrayFinder {
    return this.getAllElements('ion-item');
  }

  waitVisible() {
    const title = this.getElementByTestId(this.title);
    return this.waitForVisibleElement(title);
  }

  getItemText(item: ElementFinder) {
    return item.getText();
  }

  isImportantItem(item: ElementFinder) {
    return item.$('ion-label').getCssValue('color');
  }

  async editItem(item: ElementFinder, name: string, important: boolean, remarks: string) {
    await item.click();
    await this.itemPage.fillFields(name, important, remarks);
    await this.itemPage.clickOkButton();
    return this.waitVisible();
  }

  async deleteItem(item: ElementFinder) {
    await item.click();
    return this.itemPage.clickDeleteButton();
  }

  async editAndCancelItem(item: ElementFinder, name: string, important: boolean, remarks: string) {
    await item.click();
    await this.itemPage.fillFields(name, important, remarks);
    await this.itemPage.clickCancelButton();
    return this.waitVisible();
  }
}
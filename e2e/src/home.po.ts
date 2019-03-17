import { BasePage } from "./base.po";
import { ItemPage } from "./item.po";
import { browser, ElementFinder, ElementArrayFinder, by } from "protractor";

export class HomePage extends BasePage {

  private _addButton = 'addBtn';
  private _deleteSelectedButton = 'deleteSelectedBtn';
  private _title = 'homeTitle';
  private _itemPage = new ItemPage();
  private _importantItemColor = 'rgba(240, 65, 65, 1)';
  private _normalItemColor = 'rgba(34, 36, 40, 1)';

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
    const button = this.getElementByTestId(this._addButton);
    return this.clickButton(button);
  }

  clickDeleteSelectedButton() {
    const button = this.getElementByTestId(this._deleteSelectedButton);
    return this.clickButton(button);
  }

  async addItem(name: string, important: boolean, remarks: string) {
    await this.clickAddButton();
    await this._itemPage.fillFields(name, important, remarks);
    await this._itemPage.clickOkButton();
    return this.waitVisible();
  }

  getItems(): ElementArrayFinder {
    return this.getAllElements('ion-item');
  }

  waitVisible() {
    const title = this.getElementByTestId(this._title);
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
    await this._itemPage.fillFields(name, important, remarks);
    await this._itemPage.clickOkButton();
    return this.waitVisible();
  }

  async deleteItem(item: ElementFinder) {
    await item.click();
    return this._itemPage.clickDeleteButton();
  }

  async editAndCancelItem(item: ElementFinder, name: string, important: boolean, remarks: string) {
    await item.click();
    await this._itemPage.fillFields(name, important, remarks);
    await this._itemPage.clickCancelButton();
    return this.waitVisible();
  }

  async selectItem(item: ElementFinder) {
    await browser.actions().mouseDown(item).perform();
    await browser.sleep(300);
    return browser.actions().mouseUp(item).perform();
  }
}
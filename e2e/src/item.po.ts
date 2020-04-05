import { BasePage } from './base.po';
import { ElementFinder } from 'protractor';

export class ItemPage extends BasePage {
  private _nameInput = 'name';
  private _remarkInput = 'remarks';
  private _importantToggle = 'important';
  private _okButton = 'okBtn';
  private _cancelButton = 'cancelBtn';
  private _deleteButton = 'deleteBtn';
  private _title = 'itemTitle';

  async fillFields(name: string, important: boolean, remarks: string) {
    if (important) {
      await this.toggleImportant();
    }
    if (remarks) {
      await this.setRemarks(remarks);
    }
    return this.setName(name);
  }

  async toggleImportant() {
    const importantElement = this.getElementByTestId(this._importantToggle);
    await this.waitForVisibleElement(importantElement);
    return importantElement.click();
  }

  async setName(content: string) {
    const nameElement = this.getElementByTestId(this._nameInput);
    await this.waitForVisibleElement(nameElement);
    return this.writeInIonicInputElement(nameElement, content);
  }

  async setRemarks(content: string) {
    const remarksElement = this.getElementByTestId(this._remarkInput);
    await this.waitForVisibleElement(remarksElement);
    return this.writeInIonicTextAreaElement(remarksElement, content);
  }

  clickOkButton() {
    const okButton = this.getElementByTestId(this._okButton);
    okButton.click();
    return this.waitForNonVisibleElement(this.itemTitle());
  }

  clickDeleteButton() {
    const deleteBtn = this.getElementByTestId(this._deleteButton);
    this.clickButton(deleteBtn);
    return this.waitForNonVisibleElement(this.itemTitle());
  }

  clickCancelButton() {
    const cancelButton = this.getElementByTestId(this._cancelButton);
    cancelButton.click();
    return this.waitForNonVisibleElement(this.itemTitle());
  }

  itemTitle(): ElementFinder {
    return this.getElementByTestId(this._title);
  }
}

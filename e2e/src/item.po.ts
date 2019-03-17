import { BasePage } from "./base.po";

export class ItemPage extends BasePage {
  private _nameInput = 'name';
  private _remarkInput = 'remarks';
  private _importantToggle = 'important';
  private _okButton = 'okBtn';
  private _cancelButton = 'cancelBtn';
  private _deleteButton = 'deleteBtn';

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
    return okButton.click();
  }

  clickDeleteButton() {
    const deleteBtn = this.getElementByTestId(this._deleteButton);
    return this.clickButton(deleteBtn);
  }

  clickCancelButton() {
    const cancelButton = this.getElementByTestId(this._cancelButton);
    return cancelButton.click();
  }
}
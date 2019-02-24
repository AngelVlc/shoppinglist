import { BasePage } from "./base.po";

export class ItemPage extends BasePage {
  private nameInput = 'name';
  private remarkInput = 'remarks';
  private importantToggle = 'important';
  private okButton = 'okBtn';
  private cancelButton = 'cancelBtn';
  private deleteButton = 'deleteBtn';

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
    const importantElement = this.getElementByTestId(this.importantToggle);
    await this.waitForVisibleElement(importantElement);
    return importantElement.click();
  }

  async setName(content: string) {
    const nameElement = this.getElementByTestId(this.nameInput);
    await this.waitForVisibleElement(nameElement);
    return this.writeInIonicInputElement(nameElement, content);
  }

  async setRemarks(content: string) {
    const remarksElement = this.getElementByTestId(this.remarkInput);
    await this.waitForVisibleElement(remarksElement);
    return this.writeInIonicTextAreaElement(remarksElement, content);
  }

  clickOkButton() {
    const okButton = this.getElementByTestId(this.okButton);
    return okButton.click();
  }

  clickDeleteButton() {
    const deleteBtn = this.getElementByTestId(this.deleteButton);
    return this.clickButton(deleteBtn);
  }

  clickCancelButton() {
    const cancelButton = this.getElementByTestId(this.cancelButton);
    return cancelButton.click();
  }
}
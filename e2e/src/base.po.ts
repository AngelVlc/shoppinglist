import { browser, by, element, protractor, ElementFinder, ElementArrayFinder } from 'protractor';

export class BasePage {
  public getElementByTestId(testid: string): ElementFinder {
    return element(by.css(`[data-test-id="${testid}"]`));
  }

  public getAllElements(css: string): ElementArrayFinder {
    return element.all(by.css(css));
  }

  public waitForClickableElement(theElement: ElementFinder) {
    return browser.wait(protractor.ExpectedConditions.elementToBeClickable(theElement));
  }

  public waitForVisibleElement(theElement: ElementFinder) {
    return browser.wait(protractor.ExpectedConditions.visibilityOf(theElement));
  }

  public waitForNonVisibleElement(theElement: ElementFinder) {
    return browser.wait(protractor.ExpectedConditions.invisibilityOf(theElement));
  }

  public writeInIonicInputElement(ionicInput: ElementFinder, content: string) {
    const innerInput = ionicInput.$('input');
    innerInput.clear();
    return innerInput.sendKeys(content);
  }

  public writeInIonicNumberInputElement(ionicInput: ElementFinder, content: number) {
    const innerInput = ionicInput.$('input');
    innerInput.clear();
    return innerInput.sendKeys(content);
  }

  public writeInIonicTextAreaElement(ionicTextArea: ElementFinder, content: string) {
    const innerInput = ionicTextArea.$('textarea');
    innerInput.clear();
    return innerInput.sendKeys(content);
  }

  public async clickButton(button: ElementFinder) {
    await this.waitForClickableElement(button);
    return await button.click();
  }
}

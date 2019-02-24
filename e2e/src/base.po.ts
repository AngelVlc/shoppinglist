import { browser, by, element, protractor, ElementFinder, ElementArrayFinder } from 'protractor';

export class BasePage {
  public getElementByTestId(testid: string): ElementFinder {
    return element(by.css(`[data-test-id="${testid}"]`));
  }

  public getAllElements(css: string) : ElementArrayFinder {
    return element.all(by.css(css));
  }

  public waitForClickableElement(element: ElementFinder) {
    return browser.wait(protractor.ExpectedConditions.elementToBeClickable(element));
  }

  public waitForVisibleElement(element: ElementFinder) {
    return browser.wait(protractor.ExpectedConditions.visibilityOf(element));
  }

  public writeInIonicInputElement(ionicInput: ElementFinder, content: string) {
    const innerInput = ionicInput.$('input');
    return innerInput.sendKeys(content)
  }

  public writeInIonicTextAreaElement(ionicTextArea: ElementFinder, content: string) {
    const innerInput = ionicTextArea.$('textarea');
    return innerInput.sendKeys(content)
  }

  public async clickButton(button: ElementFinder) {
    await this.waitForClickableElement(button)
    return button.click();
  }
}
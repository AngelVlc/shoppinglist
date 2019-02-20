import { AppPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should allow to add an item', async () => {
    page.navigateTo();

    await page.waitForAddBtn();
    // await browser.driver.sleep(1000);
    await page.getAddBtn().click();
     await browser.driver.sleep(5000);
    // await browser.driver.sleep(1000);
    // const itemName = 'test item';
    // await page.getNameField().sendKeys(itemName);
    // await page.getImportantField().click();
    // await page.getRemarksField().sendKeys('this is a remark');
    // await page.getOkBtn().click();
    // await browser.driver.sleep(1000);
    // const items = await page.getItems();
    // console.log(items[0]);
    // expect(items.length).toEqual(1);
    // expect(items.first.findElement(by.css('ion-label')).getText()).toEqual(itemName + ' (+info)');


  });
});

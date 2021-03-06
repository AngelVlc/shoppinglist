import { HomePage } from './home.po';
import { browser } from 'protractor';

describe('Shopping List App', () => {
  let homePage: HomePage;

  beforeEach(async () => {
    homePage = await new HomePage();
    await homePage.navigateTo();
    await homePage.removeStorage();
  });

  it('should allow to add an important item', async () => {
    await homePage.addItem('test item', true, 'this is a remark', 5);
    const items = await homePage.getItems();
    expect(items.length).toBe(1);
    expect(await homePage.getItemText(items[0])).toEqual('5x test item (+info)');
    expect(await homePage.isImportantItem(items[0])).toEqual(homePage.importantItemColor);
  });

  it('should allow to add a non important item', async () => {
    await homePage.addItem('test item', false, null, 1);
    const items = await homePage.getItems();
    expect(items.length).toBe(1);
    expect(await homePage.getItemText(items[0])).toEqual('test item');
    expect(await homePage.isImportantItem(items[0])).toEqual(homePage.normalItemColor);
  });

  it('should allow to delete an item', async () => {
    await homePage.addItem('test item', false, null, null);
    await homePage.addItem('test item', false, null, null);
    let items = await homePage.getItems();
    expect(items.length).toBe(2);
    await homePage.deleteItem(items[0]);
    items = await homePage.getItems();
    expect(items.length).toBe(1);
  });

  it('should allow to edit an existing item', async () => {
    await homePage.addItem('test item', false, null, null);
    let items = await homePage.getItems();
    await homePage.editItem(items[0], 'replaced item', true, 'remarks', 5);
    items = await homePage.getItems();
    expect(items.length).toBe(1);
    expect(await homePage.getItemText(items[0])).toEqual('5x replaced item (+info)');
    expect(await homePage.isImportantItem(items[0])).toEqual(homePage.importantItemColor);
  });

  it('should allow to cancel the edition of an existing item', async () => {
    await homePage.addItem('test item', false, null, 1);
    let items = await homePage.getItems();
    await homePage.editAndCancelItem(items[0], ' replaced', true, 'remarks', 5);
    items = await homePage.getItems();
    expect(items.length).toBe(1);
    expect(await homePage.getItemText(items[0])).toEqual('test item');
    expect(await homePage.isImportantItem(items[0])).toEqual(homePage.normalItemColor);
  });

  it('shoul allow to move the items', async () => {
    await homePage.addItem('item 1', false, null, null);
    await homePage.addItem('item 2', false, null, null);
    let items = await homePage.getItems();
    const item1Loc = await items[1].getLocation();
    await browser.actions().
      mouseDown(items[1].$('ion-reorder')).
      mouseMove({ x: 0, y: -100 }).
      mouseUp().
      perform();
    await browser.sleep(1000);
    items = await homePage.getItems();
    expect(item1Loc).not.toEqual(await items[0].getLocation());
  });

  it('should allow to delete several items', async () => {
    await homePage.addItem('item 1', false, null, 1);
    await homePage.addItem('item 2', false, null, 1);
    await homePage.addItem('item 3', false, null, 1);
    await homePage.addItem('item 4', false, null, 1);
    await browser.sleep(500);
    let items = await homePage.getItems();
    await homePage.selectItem(items[1].$('ion-label'));
    await homePage.selectItem(items[2].$('ion-label'));
    await homePage.selectItem(items[3].$('ion-label'));
    await homePage.clickDeleteSelectedButton();
    items = await homePage.getItems();
    expect(items.length).toEqual(1);
  });
});

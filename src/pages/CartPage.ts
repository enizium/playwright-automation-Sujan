import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";

export default class CartPage {
  private readonly checkoutBtn = '//*[@class="btn_action checkout_button"]';
  private readonly cartLinkLocator = '.shopping_cart_link'; 
  private readonly cartBadgeLocator = '//*[@id="shopping_cart_container"]/a/span'; 
  private readonly productNames = '.inventory_item_name';
  private readonly productPrices = '.inventory_item_price'
  private readonly removeButtons = '.btn_secondary.cart_button';
  private readonly cartItemLocator = '.cart_item';

  constructor(private page: Page) {}

  async verifyItemsInCart() {
    // Click on the cart link to navigate to the cart page
    await this.page.click(this.cartLinkLocator);
    await this.page.waitForLoadState('load'); // Wait for the cart page to load completely

    // Get the number of items in the cart
    const cartBadgeCount = await this.page.locator(this.cartBadgeLocator).textContent();
    // Check if the cart is not empty
    if (parseInt(cartBadgeCount || '0') > 0) {
      this.validateCartItem()
    } else {
      logger.warn('The cart is empty.');
    }
  }

  async validateCartItem(){
        // Retrieve stored cart items from local storage
    const storedCartItems = await this.page.evaluate(() => {
      const items = localStorage.getItem('cartItems');
      return items ? JSON.parse(items) : [];
    });

    console.log('Stored items in cart page:', storedCartItems);
     // Get the names and prices of items currently in the cart
     const cartItemNames = await this.page.$$eval(this.productNames, items =>
      items.map(item => item.textContent?.trim() || '')
    );
    // const cartItemPrices = await this.page.$$eval('.inventory_item_price', items =>
    const cartItemPrices = await this.page.$$eval(this.productPrices, items =>
      items.map(item => item.textContent?.trim() || '')
    );

    // Convert cart items and stored items to arrays of objects with name and price
    const cartItems = cartItemNames.map((name, index) => ({
      name,
      price: cartItemPrices[index].replace(/^\$/, '')
    }));
    
    const sortedCartItems = cartItems.sort((a, b) => a.name.localeCompare(b.name));
    const sortedStoredItems = storedCartItems.sort((a, b) => a.name.localeCompare(b.name));

    // Verify that each item's name and price match what was stored
    sortedStoredItems.forEach((item, index) => {
      expect(sortedCartItems[index].name).toBe(item.name);
      expect(sortedCartItems[index].price).toBe(item.price.replace(/^\$/, ''));
    });  
    logger.info('Verified items in the cart match the items added.');
  }

  async deleteAllCartItems() {
    const removeButtons = this.page.locator(this.removeButtons);
    const itemsInCart = await removeButtons.count();
    console.log(`Items in cart: ${itemsInCart}`);

    for (let i = 0; i < itemsInCart; i++) {
      await removeButtons.nth(0).click(); // always click the first one since list updates
    }
    await expect(this.page.locator(this.cartItemLocator)).toHaveCount(0);
  }

  async clickCheckoutBtn() {
    await this.page.locator(this.checkoutBtn).click();
  }
}

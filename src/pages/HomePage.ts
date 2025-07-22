import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";


// Define an interface for product details
interface ProductDetails {
  name: string;
  price: string;
}


export default class HomePage {
  private readonly contactsLinkLocator = "Contacts";
  private readonly productsTitle = '#inventory_filter_container > div';
  private readonly sortDropdownLocator = '.product_sort_container';
  private readonly productNamesLocator = '.inventory_item_name';
  private readonly productPricesLocator = '.inventory_item_price';
  private readonly productLocator = '.inventory_item_name';
  private readonly addToCartButtonLocator = '.btn_inventory';
  private readonly cartBadgeLocator = '//*[@id="shopping_cart_container"]/a/span'; 
  private readonly pageTitleLocator = '.product_label';
  private readonly allItems = '#inventory_sidebar_link';
  private readonly pageMenu = '//*[@id="menu_button_container"]//div[3]//button';

  private productName(i: number): string {
    return `//*[@class='inventory_item'][${i}]//*[@class='inventory_item_name']`
    // return `(//*[@class='inventory_list']//a/div)[${i}]`;
  }

  private productPrice(i: number): string {
    return `//*[@class='inventory_item'][${i}]//*[@class='inventory_item_price']`;
  }

  private addToCartBtn(i: number): string {
    return `//*[@class='inventory_item'][${i}]//*[@class='btn_primary btn_inventory']`;
  }

  private removeFromCartBtn(i: number): string {
    return `//*[@class='inventory_item'][${i}]//*[@class='btn_secondary btn_inventory']`;
  }


  constructor(private page: Page) {}

  async expectServiceTitleToBeVisible() {
    try {
      // Wait for the page to fully load
      await this.page.waitForLoadState('load');

      // Locate the productsTitle using the provided selector
      const productsTitleText = this.page.locator(this.productsTitle);

      // Wait for the productsTitle to be visible
      await expect(productsTitleText).toBeVisible({
        timeout: 15000,
      });

      // Validate the text content of the productsTitle
      const actualProductTitle = await productsTitleText.textContent();
      const expectedText = 'Products'; // Replace with the expected text

      expect(actualProductTitle).toContain(expectedText);
      logger.info(`Text '${expectedText}' is visible`);
    } catch (error) {
      logger.error(`Error verifying text in the specified element: ${error}`);
      throw error; // Rethrow the error if needed
    }
  }
  
    // Apply filter by name in descending order
    async applyFilterByNameDesc() {
      await this.page.selectOption(this.sortDropdownLocator, 'za' ); // Assuming 'Name (Z to A)' is the value for descending name order
      logger.info('Applied filter by Name (Descending Order)');
       // Verify the selected option in the dropdown
      const selectedOption = await this.page.locator(`${this.sortDropdownLocator} option:checked`).innerText();
      expect(selectedOption).toBe('Name (Z to A)'); // validating 'Name (Z to A)'  was selected
      logger.info(`Selected sort option is correctly displayed as: ${selectedOption}`);
    }

     // Apply filter by price from Low to High and validate selection
    async applyFilterByPriceLowToHigh() {
      await this.page.selectOption(this.sortDropdownLocator, { value:'lohi' });
      logger.info('Applied filter by Price (Low to High)');

      // Verify the selected option in the dropdown
      const selectedOptionText = await this.page.locator(`${this.sortDropdownLocator} option:checked`).innerText();
      expect(selectedOptionText).toBe('Price (low to high)'); // Adjusted case to match actual text
      logger.info(`Selected sort option is correctly displayed as: ${selectedOptionText}`);
    }

    // Verify the products are sorted by name in descending order
    async verifyProductsSortedByNameDesc() {
      const productNames = await this.page.$$eval(this.productNamesLocator, items => items.map(item => item.textContent?.trim() || ''));

      // Create a copy of the array and sort it in descending order
      const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));
      expect(productNames).toEqual(sortedNames);
      logger.info('Product listings are correctly sorted by Name (Descending Order)');
    }

    // Verify the products are sorted by price from low to high
    async verifyProductsSortedByPriceLowToHigh() {
      const productPrices = await this.page.$$eval(this.productPricesLocator, items => items.map(item => parseFloat(item.textContent?.replace('$', '') || '0')));

      const sortedPrices = [...productPrices].sort((a, b) => a - b);
      expect(productPrices).toEqual(sortedPrices);
      logger.info('Product listings are updated according to the Price (Low to High) filter');
    }
 
    async addItemsToCart() {
      const productDetails: ProductDetails[] = [];
      
      for (let i = 1; i <= 2; i++) { // Adjust the number of items to add

        const productName = await this.page.locator(this.productName(i)).textContent();
        const productPrice = await this.page.locator(this.productPrice(i)).textContent();

        if (productName && productPrice) {

          const cleanedPrice = productPrice?.replace(/[^0-9.]/g, '').trim() || '';
        // Click Add to Cart
        await this.page.locator(this.addToCartBtn(i)).click();

         // Verify the button text changes to "Remove"
        const buttonText = await this.page.locator(this.removeFromCartBtn(i)).textContent();
        expect(buttonText?.trim()).toBe('REMOVE');        
        
        // Store product details
        productDetails.push({ name: productName?.trim(), price: cleanedPrice });
        }
      }
      // Sort the product details array by product name in ascending order
      productDetails.sort((a, b) => a.name.localeCompare(b.name));

      //   Verify the cart badge count matches the number of items added
      const cartBadgeCount = await this.page.locator(this.cartBadgeLocator).textContent();
      expect(parseInt(cartBadgeCount || '0')).toBe(productDetails.length);

    // Store product details in local storage
      await this.page.evaluate((items) => {
        localStorage.setItem('cartItems', JSON.stringify(items));
      }, productDetails);

      // Retrieve and log the stored items from local storage
      const storedItems = await this.page.evaluate(() => {
        const items = localStorage.getItem('cartItems');
        return items ? JSON.parse(items) : [];
      });

      console.log('Stored items:', storedItems);  
      logger.info('Items added to cart and stored in local storage');
    }
  

    async navigateToContactTab(){

      await expect(this.page.getByRole('link', { name: this.contactsLinkLocator })).toBeVisible();
      logger.info("Contacts Tab is visible")
      await this.page.getByRole('link', { name: this.contactsLinkLocator }).click();
      logger.info("Contacts Tab is clicked")
      // return new ContactPage(this.page);
      
    }

    async navigateToCaseTab(){

      await expect(this.page.getByRole('link', { name: this.contactsLinkLocator })).toBeVisible();
      logger.info("Contacts Tab is visible")
      await this.page.getByRole('link', { name: this.contactsLinkLocator }).click();
      logger.info("Contacts Tab is clicked")
      // return new ContactPage(this.page);
      
    }

    async navigateToAllItems(){
      await this.page.click(this.pageMenu);
      await this.page.click(this.allItems);
      const title = this.page.locator(this.pageTitleLocator); // This is the title element
      await expect(title).toHaveText('Products');
    }
}

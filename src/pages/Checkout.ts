import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";
import { faker } from "@faker-js/faker";

export default class CheckoutPage {
  private readonly firstname = '#first-name';
  private readonly lastname = '#last-name'; 
  private readonly postalcode = '#postal-code'; 
  private readonly contineBtn='//*[@class="btn_primary cart_button"]'

  constructor(private page: Page) {}

  async YourInformation(){
    await this.page.locator(this.firstname).fill(faker.person.firstName('male'));
    await this.page.locator(this.lastname).fill(faker.person.lastName('male'));
    await this.page.locator(this.postalcode).fill(faker.address.zipCode());   
    logger.info("Entered Personal information") 
  }

  async clickContinueBtn() {
    await this.page.locator(this.contineBtn).click();
    logger.info('Continue button clicked in checkout page');
  }


}
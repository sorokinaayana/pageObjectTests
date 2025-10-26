import { BasePage } from './base-page.js';
import { TestData } from '../test-data.js';

export class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Your Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
  }

  async navigate() {
    await this.page.goto('https://realworld.qa.guru/#/register');
  }

  async registerNewUser() {
    const userData = TestData.generateUser();
    
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.signUpButton.click();
    
    await this.page.waitForURL('https://realworld.qa.guru/#/');
    return userData;
  }
}

import { test, expect } from '@playwright/test';
import { RegisterPage, ProfilePage } from '../src/pages';

test.describe('Действия с профилем', () => {
  let registerPage, profilePage;
  let userData;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    profilePage = new ProfilePage(page);
    
    await registerPage.navigate();
    userData = await registerPage.registerNewUser();
  });

  test('редактирование био в профиле', async () => {
    await profilePage.navigateToProfile(userData.username);
    await profilePage.navigateToEditProfile();
    
    const newBio = 'Тестовое био ' + Date.now();
    await profilePage.updateBio(newBio);
    
    await expect(profilePage.bioInput).toHaveValue(newBio);
  });
});

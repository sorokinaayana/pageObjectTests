import { test, expect } from '@playwright/test';
import { RegisterPage, EditorPage, ArticlePage, CommentPage } from '../src/pages';

test.describe('Действия со статьями', () => {
  let registerPage, editorPage, articlePage, commentPage;
  let userData, articleData;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    editorPage = new EditorPage(page);
    articlePage = new ArticlePage(page);
    commentPage = new CommentPage(page);
    
    await registerPage.navigate();
    userData = await registerPage.registerNewUser();
    
    await page.getByRole('link', { name: 'New Article' }).click();
    articleData = await editorPage.createNewArticle();
  });

  test('создание статьи', async () => {
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.articleBody).toContainText(articleData.body);
  });

  test('редактирование статьи', async () => {
    await articlePage.clickEditArticle();
    await expect(editorPage.articleBodyInput).toBeVisible();
    
    const updatedContent = 'Обновлённое содержание ' + Date.now();
    await editorPage.updateArticleBody(updatedContent);
    
    await expect(articlePage.articleBody).toContainText(updatedContent);
  });

  test('удаление статьи', async ({ page }) => {
    const articleTitle = articleData.title;
    await articlePage.deleteArticle();
    
    await page.getByRole('link', { name: userData.username }).first().click();
    await expect(page.locator('.article-preview').filter({ hasText: articleTitle })).not.toBeVisible();
  });

  test('добавление и удаление комментария', async () => {
    const commentText = 'Тестовый комментарий ' + Date.now();
    
    // Добавляем комментарий
    await commentPage.addComment(commentText);
    
    // Проверяем что комментарий видим
    expect(await commentPage.isCommentVisible(commentText)).toBeTruthy();
    
    // Удаляем комментарий
    await commentPage.deleteLastComment();
    
    // Проверяем что комментарий не видим
    expect(await commentPage.isCommentVisible(commentText)).toBeFalsy();
  });
});

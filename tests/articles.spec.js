import { test, expect } from '@playwright/test';
import { RegisterPage, EditorPage, ArticlePage, CommentPage, MainPage } from '../src/pages';

test.describe('Действия со статьями', () => {
  let registerPage, editorPage, articlePage, commentPage, mainPage;
  let userData, articleData;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    editorPage = new EditorPage(page);
    articlePage = new ArticlePage(page);
    commentPage = new CommentPage(page);
    mainPage = new MainPage(page);
    
    await registerPage.navigate();
    userData = await registerPage.registerNewUser();
  });

  test('создание статьи', async () => {
    await mainPage.navigateToNewArticle();
    articleData = await editorPage.createNewArticle();
    
    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.articleBody).toContainText(articleData.body);
  });

  test('редактирование статьи', async () => {
    await mainPage.navigateToNewArticle();
    articleData = await editorPage.createNewArticle();
    
    await articlePage.clickEditArticle();
    await expect(editorPage.articleBodyInput).toBeVisible();
    
    const updatedContent = 'Обновлённое содержание ' + Date.now();
    await editorPage.updateArticleBody(updatedContent);
    
    await expect(articlePage.articleBody).toContainText(updatedContent);
  });

  test('удаление статьи', async () => {
    await mainPage.navigateToNewArticle();
    articleData = await editorPage.createNewArticle();
    
    await articlePage.deleteArticle();
    
    await mainPage.navigateToUserProfile(userData.username);
    expect(await mainPage.isArticleVisible(articleData.title)).toBeFalsy();
  });

  test('добавление и удаление комментария', async () => {
    await mainPage.navigateToNewArticle();
    articleData = await editorPage.createNewArticle();
    
    const commentText = 'Тестовый комментарий ' + Date.now();
    
    await commentPage.addComment(commentText);
    expect(await commentPage.isCommentVisible(commentText)).toBeTruthy();
    
    await commentPage.deleteLastComment();
    expect(await commentPage.isCommentVisible(commentText)).toBeFalsy();
  });
});

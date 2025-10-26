export class TestData {
  static generateUser() {
    const timestamp = Date.now();
    return {
      username: 'user_' + timestamp,
      email: 'test' + timestamp + '@example.com',
      password: 'Password123!'
    };
  }

  static generateArticle() {
    const timestamp = Date.now();
    return {
      title: 'Статья ' + timestamp,
      description: 'Статья для домашнего задания',
      body: 'Содержание статьи для домашнего задания',
      tags: ['testQAGURU', 'autotest']
    };
  }
}

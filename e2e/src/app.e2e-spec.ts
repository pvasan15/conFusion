import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display message saying Ristorante Con Fusion', () => {
    page.navigateTo('/');
    expect(page.getParagraphText('app-root h1')).toEqual('Ristorante Con Fusion');
  });

  it('should navigate to about us page by clicking on the link about us', () => {
    page.navigateTo('/');
    let navlink = page.getAllElements('a').get(1);
    navlink.click();
    expect(page.getParagraphText('app-root h3')).toBe('About Us');
  })

  it('should enter a new comment for the first dish', () => {
    page.navigateTo('/dishdetail/0');

    const newAuthor = page.getElement('input[type=text]');
    newAuthor.sendKeys('Test Author 1');

    const newComment = page.getElement('textarea');
    newComment.sendKeys('Test Comment 1');

    const newSubmitButton = page.getElement('button[type=submit]');
    newSubmitButton.click();

    browser.pause();
  })
});

import { browser, by, element } from 'protractor';

describe('My Angular V17 App E2E Tests', () => {
  it('should display the app title', () => {
    browser.get('/');
    expect(element(by.css('app-root h1')).getText()).toEqual('Welcome to My Angular V17 App!');
  });

  it('should navigate to a feature page', () => {
    browser.get('/');
    element(by.css('a[href="/feature"]')).click();
    expect(browser.getCurrentUrl()).toContain('/feature');
  });

  it('should display error message on failed API call', () => {
    // Simulate an API call failure and check for error message
    browser.get('/api/failure');
    expect(element(by.css('.error-message')).isDisplayed()).toBe(true);
  });
});
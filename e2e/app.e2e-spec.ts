import { ESintV2Page } from './app.po';

describe('e-sint-v2 App', () => {
  let page: ESintV2Page;

  beforeEach(() => {
    page = new ESintV2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

import { VegePage } from './app.po';

describe('vege App', function() {
  let page: VegePage;

  beforeEach(() => {
    page = new VegePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

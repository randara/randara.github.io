// spec.js
describe('instamatch homepage', function() {
  beforeEach(function() {
    browser.get('http://randara.github.io/instamatch');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('InstaMatch');
  });

  it('should valid default tag', function() {
  	
  	expect(element(by.id('startGameButton')).getText()).toEqual('Start game');
  	expect(element(by.id('startGameButtonError')).getText()).toEqual('');
  });


  it('should valid a one word tag', function() {
  	element(by.model('tag')).sendKeys('anyTag');
  	
  	expect(element(by.id('startGameButton')).getText()).toEqual('Start game');
  	expect(element(by.id('startGameButtonError')).getText()).toEqual('');
  });

  it('should invalid more than one word tag', function() {
  	element(by.model('tag')).sendKeys('anyTag otherTag');
  	
  	expect(element(by.id('startGameButton')).getText()).toEqual('');
  	expect(element(by.id('startGameButtonError')).getText()).toEqual('Must be a single word!!');
  });

 it('should detect API tag errors', function() {
  	element(by.model('tag')).sendKeys('sex');
  	element(by.id('startGameButton')).click();

  	expect(element(by.id('alert-message')).getText()).toEqual('Tag sex is not valid');
  });
  

});
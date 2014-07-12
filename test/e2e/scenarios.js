'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe("wsiApp", function() {
  describe("Card View", function() {
    var ptor;

    beforeEach(function() {
      browser.get("index.html");
      ptor = protractor.getInstance();
    });

//    it("Should have cards", function() {
//      var cardList = element.all(by.repeater("card in cards"));
//      expect(cardList.count()).toBe(2);
//    });

    it("Should add a new card", function() {
      element.all(by.repeater("card in cards")).count().then(function(cardCount) {
        element(by.css("#add_card")).click();
        var cardList = element.all(by.repeater("card in cards"));
        expect(cardList.count()).toBe(cardCount + 1);
      });
    });

    it("Should flip a card", function() {
      element(by.css(".flip")).click();
      expect(ptor.isElementPresent(by.css(".back"))).toBe(true);
    });

    it("Should reset a card", function() {
      element(by.repeater("card in cards")).element.all(by.css(".flip")).get(0).click();
      var frequency = element(by.css(".card")).element(by.model("card.frequencyValue"));
      frequency.sendKeys("10");
      element(by.repeater("card in cards")).element.all(by.css(".flip")).get(1).click();
      var nextTime = element(by.repeater("card in cards")).element(by.css(".next"));
      expect(nextTime.getText()).toMatch(/in 10 minutes/);
    });
  });
});
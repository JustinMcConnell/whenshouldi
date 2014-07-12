'use strict';

/* jasmine specs for controllers go here */

describe("CardsCtrl", function() {
  var testCards = [{
        "id": 1,
        "title": "alpha", 
        "frequency": 60000,
        "history": [
         new Date()
        ]
      },{
        "id": 2,
        "title": "beta", 
        "frequency": 600000,
        "history": [
         new Date()
        ]
      }], 
      scope,
      ctrl, 
      $httpBackend,
      $timeout;

  beforeEach(module("wsiApp"));

  beforeEach(inject(function(_$httpBackend_, _$timeout_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('cards/cards.json').respond(testCards);
    $timeout = _$timeout_;

    scope = $rootScope.$new();
    ctrl = $controller('CardsCtrl', {$scope: scope});
  }));

  it("Has a card", function() {
    expect(scope.cards).toBeUndefined();
    $httpBackend.flush();
    expect(scope.cards.length).toBeGreaterThan(0);
  });

  it("Flips a card", function() {
    $httpBackend.flush();
    expect(scope.cards[0].flipped).toBeUndefined();
    scope.flip(scope.cards[0]);
    expect(scope.cards[0].flipped).toBe(true);
    scope.flip(scope.cards[0]);
    expect(scope.cards[0].flipped).toBe(false);
  });

  it("Adds a card", function() {
    $httpBackend.flush();
    var cardCount = scope.cards.length;
    scope.addCard();
    expect(scope.cards.length).toBe(cardCount + 1);
  });

  describe("Updates the card frequency", function() {
    var card;

    beforeEach(function() {
      $httpBackend.flush();
      card = scope.cards[0];
    });

    it("in minutes", function() {
      card.frequencyValue = 1;
      scope.updateCardFrequency(card, "minute");
      expect(card.frequency).toBe(1000 * 60);
    });
    it("in hours", function() {
      card.frequencyValue = 1;
      scope.updateCardFrequency(card, "hour");
      expect(card.frequency).toBe(1000 * 60 * 60);
    });
    it("in days", function() {
      card.frequencyValue = 1;
      scope.updateCardFrequency(card, "day");
      expect(card.frequency).toBe(1000 * 60 * 60 * 24);
    });
    it("in weeks", function() {
      card.frequencyValue = 1;
      scope.updateCardFrequency(card, "week");
      expect(card.frequency).toBe(1000 * 60 * 60 * 24 * 7);
    });
    it("in months", function() {
      card.frequencyValue = 1;
      scope.updateCardFrequency(card, "month");
      expect(card.frequency).toBe(1000 * 60 * 60 * 24 * 31);
    });
    it("in years", function() {
      card.frequencyValue = 1;
      scope.updateCardFrequency(card, "year");
      expect(card.frequency).toBe(1000 * 60 * 60 * 24 * 365.242);
    });
    it("frequency type not set", function() {
      card.frequencyValue = 1;
      scope.updateCardFrequency(card, "");
      expect(card.frequency).toBe(1000 * 60);
    });
    it("frequency type not supported", function() {
      card.frequencyValue = 1;
      var currentFrequency = card.frequency;
      scope.updateCardFrequency(card, "bananafone");
      expect(card.frequency).toBe(currentFrequency);
    });
    it("frequency value not set", function() {
      card.frequencyValue = undefined;
      var currentFrequency = card.frequency;
      scope.updateCardFrequency(card, "minute");
      expect(card.frequency).toBe(currentFrequency);
    });
    it("frequency value less than 1", function() {
      card.frequencyValue = -1;
      var currentFrequency = card.frequency;
      scope.updateCardFrequency(card, "minute");
      expect(card.frequency).toBe(currentFrequency);
    });

  });

  describe("Shows a next time", function() {
    var card;

    beforeEach(function() {
      $httpBackend.flush();
      card = scope.cards[0];
    });

    it("foo", function() {
      expect(scope.nextTime(card)).toBe("in a minute");
    })    
  });
  describe("Shows a last time", function() {
    var card;

    beforeEach(function() {
      $httpBackend.flush();
      card = scope.cards[0];
    });

    it("foo", function() {
      expect(scope.lastTime(card)).toBe("a few seconds ago");
    })    
  });

  it("Calculates a next ID", function() {
    $httpBackend.flush();
    expect(scope.nextCardId()).toBe(3);
  });

  describe("Calculates frequency types", function() {
    it("minutes", function() {
      expect(scope.calculateFrequencyType(60 * 1000)).toBe("minute");
    });
    it("hours", function() {
      expect(scope.calculateFrequencyType(60 * 60 * 1000)).toBe("hour");
    });
    it("days", function() {
      expect(scope.calculateFrequencyType(24 * 60 * 60 * 1000)).toBe("day");
    });
    it("weeks", function() {
      expect(scope.calculateFrequencyType(7 * 24 * 60 * 60 * 1000)).toBe("week");
    });
    it("months", function() {
      expect(scope.calculateFrequencyType(31 * 24 * 60 * 60 * 1000)).toBe("month");
    });
    it("years", function() {
      expect(scope.calculateFrequencyType(365.242 * 24 * 60 * 60 * 1000)).toBe("year");
    }); 
  });

  describe("Calculates frequency values", function() {
    it("1 minute", function() {
      expect(scope.calculateFrequencyValue(60 * 1000)).toBe(1);
    });
    it("5 minutes", function() {
      expect(scope.calculateFrequencyValue(5 * 60 * 1000)).toBe(5);
    });
    it("59 minute", function() {
      expect(scope.calculateFrequencyValue(59 * 60 * 1000)).toBe(59);
    });
    it("1 hour", function() {
      expect(scope.calculateFrequencyValue(60 * 60 * 1000)).toBe(1);
    });
    it("10 hours", function() {
      expect(scope.calculateFrequencyValue(10 * 60 * 60 * 1000)).toBe(10);
    });
    it("23 hours", function() {
      expect(scope.calculateFrequencyValue(23 * 60 * 60 * 1000)).toBe(23);
    });
    it("1 day", function() {
      expect(scope.calculateFrequencyValue(24 * 60 * 60 * 1000)).toBe(1);
    });
    it("6 days", function() {
      expect(scope.calculateFrequencyValue(6 * 24 * 60 * 60 * 1000)).toBe(6);
    });
    it("1 week", function() {
      expect(scope.calculateFrequencyValue(7 * 24 * 60 * 60 * 1000)).toBe(1);
    });
    it("4 weeks", function() {
      expect(scope.calculateFrequencyValue(4 * 7 * 24 * 60 * 60 * 1000)).toBe(4);
    });
    it("1 month", function() {
      expect(scope.calculateFrequencyValue(31 * 24 * 60 * 60 * 1000)).toBe(1);
    });
    it("11 months", function() {
      expect(scope.calculateFrequencyValue(11 * 31 * 24 * 60 * 60 * 1000)).toBe(11);
    });
    it("1 year", function() {
      expect(scope.calculateFrequencyValue(365.242 * 24 * 60 * 60 * 1000)).toBe(1);
    });
    it("2 years", function() {
      expect(scope.calculateFrequencyValue(2 * 365.242 * 24 * 60 * 60 * 1000)).toBe(2);
    });
  });

  it("Deletes a card", function() {
    $httpBackend.flush();
    var numCards = scope.cards.length;
    scope.deleteCard(scope.cards[0]);
    $timeout.flush();
    expect(scope.cards.length).toBe(numCards - 1);
  });
});

'use strict';

/* Services */
wsiApp.factory('CardsService', ['$firebase', function($firebase) {
  var ref = new Firebase("https://torid-fire-5877.firebaseIO.com/whenshouldi/cards");
  var cards = $firebase(ref);

/*
  cardsRef.$bind(this, "cards").then(function() {
    var keys = cards.$getIndex();
    keys.forEach(function(key) {
      initCard(cards[key]);
    })
  }); 
*/

  var initCard = function(card) {
    $interval(function() {
      $scope.nextTime(card);
      $scope.lastTime(card);
    }, 60000);
  };

  var getCards = function() {
    return cards;
  }

  var createCard = function(card, callback) {
    cards.$add(card).then(callback);
  };

  var updateCard = function(card) {
    cards.$save(card.id);
  };

  var deleteCard = function(card) {
    if (card.id) {
      cards.$remove(card.id);
    }
  };

  return {
    getCards: getCards,
    createCard: createCard,
    updateCard: updateCard,
    deleteCard: deleteCard
  };

}]);
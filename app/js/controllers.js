'use strict';

/* Controllers */
wsiApp.controller('CardsCtrl', ['$scope', '$interval', '$timeout', 'CardsService', function($scope, $interval, $timeout, CardsService) {
  $scope.cards = CardsService.getCards();
  $scope.order = "-id";
  $scope.animationDuration = 333;

  $scope.createCard = function() {
    var defaultCardData = {
      "title": "",
      "frequency": 60000,
      "frequencyType": "minute",
      "frequencyValue": 1,
      "history": [new Date()],
      "flipped": false
    };

    CardsService.createCard(defaultCardData, function(ref) {
      $timeout(function() {
        var card = $scope.cards[ref.name()];
        card.id = ref.name();
        $scope.flipCard(card);
        $scope.updateCard(card);
      }, $scope.animationDuration);
    });
  };

  $scope.updateCard = function(card) {
    CardsService.updateCard(card);
  }

  $scope.deleteCard = function(card) {
    $("#card_" + card.id).removeClass("fadeInLeft").addClass("fadeOutLeft");
    $timeout(function() {
      CardsService.deleteCard(card);
    }, $scope.animationDuration);
  };

  $scope.flipCard = function(card) {
    card.flipped = !card.flipped;
    $scope.updateCard(card);
  };

  $scope.lastTime = function(card) {
    return moment(card.history[card.history.length - 1]).fromNow();
  };

  $scope.nextTime = function(card) {
    return moment(new Date(card.history[card.history.length - 1]).getTime() + card.frequency).fromNow();
  };

  $scope.cardDone = function(card) {
    card.history.push(new Date());
    $scope.updateCard(card);
    //$scope.nextTime(card);
    //$scope.lastTime(card);
  };

  $scope.calculateFrequencyType = function(frequency) {
    if (frequency >= (60 * 1000) && frequency < (60 * 60 * 1000)) {
      return "minute";
    } else if (frequency < (24 * 60 * 60 * 1000)) {
      return "hour";
    } else if (frequency < (7 * 24 * 60 * 60 * 1000)) {
      return "day";
    } else if (frequency < (31 * 24 * 60 * 60 * 1000)) {
      return "week";
    } else if (frequency < (365.242 * 24 * 60 * 60 * 1000)) {
      return "month";
    } else if (frequency >= (365.242 * 24 * 60 * 60 * 1000)) {
      return "year";
    }
  };

  $scope.calculateFrequencyValue = function(frequency) {
    // minute(s)
    if (frequency >= (60 * 1000) && frequency < (60 * 60 * 1000)) {
      return frequency / (60 * 1000);
    // hour(s)
    } else if (frequency < (24 * 60 * 60 * 1000)) {
      return frequency / (60 * 60 * 1000);
    // day(s)
    } else if (frequency < (7 * 24 * 60 * 60 * 1000)) {
      return frequency / (24 * 60 * 60 * 1000);
    // week(s)
    } else if (frequency < (31 * 24 * 60 * 60 * 1000)) {
      return frequency / (7 * 24 * 60 * 60 * 1000);
    // month(s)
    } else if (frequency < (365.242 * 24 * 60 * 60 * 1000)) {
      return frequency / (31 * 24 * 60 * 60 * 1000);
    // year(s)  
    } else if (frequency >= (365.242 * 24 * 60 * 60 * 1000)) {
      return frequency / (365.242 * 24 * 60 * 60 * 1000);
    }
  };

  $scope.updateCardFrequency = function(card, type) {
    if (typeof type !== "undefined") {
      card.frequencyType = type;
    }
    if (!card.frequencyType) {
      card.frequencyType = "minute";
    }

    var value = card.frequencyValue;
    if (!value || value <= 0) {
      return;
    }

    var totalMilliseconds = value * 1000;
    if (card.frequencyType == "minute") {
      totalMilliseconds *= 60;
    } else if (card.frequencyType == "hour") {
      totalMilliseconds *= 60 * 60;
    } else if (card.frequencyType == "day") {
      totalMilliseconds *= 60 * 60 * 24;
    } else if (card.frequencyType == "week") {
      totalMilliseconds *= 60 * 60 * 24 * 7;
    } else if (card.frequencyType == "month") { // TODO: A month is not always 31 days.
      totalMilliseconds *= 60 * 60 * 24 * 31;
    } else if (card.frequencyType == "year") {
      totalMilliseconds *= 60 * 60 * 24 * 365.242;
    // frequency type not supported
    } else {
      return;
    }

    card.frequency = totalMilliseconds;
    $scope.updateCard(card);
  };
}]);
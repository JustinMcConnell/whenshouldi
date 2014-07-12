'use strict';

/* Controllers */
wsiApp.controller('CardsCtrl', ['$scope', '$http', '$interval', '$timeout', '$firebase', function($scope, $http, $interval, $timeout, $firebase) {
  $scope.firebase = $firebase(new Firebase("https://torid-fire-5877.firebaseIO.com/whenshouldi/cards"));
  $scope.firebase.$bind($scope, "cards").then(function() {
    var keys = $scope.cards.$getIndex();
    keys.forEach(function(key) {
      $scope.initCard($scope.cards[key]);
    })
  });

  $scope.order = "-id";
  $scope.animationDuration = 333;

  $scope.initCard = function(card) {
    $interval(function() {
      $scope.nextTime(card);
      $scope.lastTime(card);
    }, 60000);
  };

  $scope.addCard = function() {
    var defaultCardData = {
      "title": "",
      "frequency": 60000,
      "frequencyType": "minute",
      "frequencyValue": 1,
      "history": [new Date()],
      "flipped": false
    };

    // If there are no cards, then $scope.cards is empty and we add to $scope.firebase.
    var obj = 0 && typeof $scope.cards === "object" ? $scope.cards : $scope.firebase;
    obj.$add(defaultCardData).then(function(ref) {
      var card = $scope.cards[ref.name()];
      card.id = ref.name();
      $timeout(function() {
        $scope.flipCard(card);
      }, $scope.animationDuration);
    });
  };

  $scope.deleteCard = function(card) {
    $("#card_" + card.id).removeClass("fadeInLeft").addClass("fadeOutLeft");
    $timeout(function() {
      $scope.cards.$remove(card.id);
    }, $scope.animationDuration);
  };

  $scope.flipCard = function(card) {
    card.flipped = !card.flipped;
  };

  $scope.lastTime = function(card) {
    return moment(card.history[card.history.length - 1]).fromNow();
  };

  $scope.nextTime = function(card) {
    return moment(new Date(card.history[card.history.length - 1]).getTime() + card.frequency).fromNow();
  };

  $scope.cardDone = function(card) {
    card.history.push(new Date());
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
    card.frequencyType = type;
    var value = card.frequencyValue;

    if (!value || value <= 0) {
      return;
    }
    if (!card.frequencyType) {
      card.frequencyType = "minute";
    }

    var total = value * 1000;
    if (card.frequencyType == "minute") {
      total *= 60;
    } else if (card.frequencyType == "hour") {
      total *= 60 * 60;
    } else if (card.frequencyType == "day") {
      total *= 60 * 60 * 24;
    } else if (card.frequencyType == "week") {
      total *= 60 * 60 * 24 * 7;
    } else if (card.frequencyType == "month") { // TODO: A month is not always 31 days.
      total *= 60 * 60 * 24 * 31;
    } else if (card.frequencyType == "year") {
      total *= 60 * 60 * 24 * 365.242;
    // frequency type not supported
    } else {
      return;
    }

    card.frequency = total;
  };
}]);
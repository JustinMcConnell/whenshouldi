'use strict';

/* Controllers */
wsiApp.controller('CardsCtrl', ['$scope', '$http', '$interval', '$timeout', function($scope, $http, $interval, $timeout) {
  $scope.cards = [];

if (1) {
  $scope.firebase = new Firebase("https://torid-fire-5877.firebaseIO.com");
  $scope.firebase.on("child_added", function(snapshot) {
    var card = snapshot.val();
    $scope.initCard(card);
    $scope.cards.push(card);
    console.log(card);
    $timeout(function() {/*noop*/}, 1);
  });
}

if (0) {
  $http.get('cards/cards.json').success(function(data) {
    $scope.cards = data;
    $scope.cards.forEach($scope.initCard);
  });
}

  $scope.order = "-id";

  $scope.initCard = function(card) {
    if (!card.history) {
      card.history = [];
      card.history.push(new Date());
    }
    card.frequencyType = $scope.calculateFrequencyType(card.frequency);
    card.frequencyValue = $scope.calculateFrequencyValue(card.frequency);
    $interval(function() {
      $scope.nextTime(card);
      $scope.lastTime(card);
    }, 60000);
  };

  $scope.addCard = function() {
    $scope.cards.push({
      "id": $scope.nextCardId(),
      "title": "",
      "frequency": 60000,
      "frequencyType": "minute",
      "frequencyValue": 1,
      "history": [new Date()]
    });
    $timeout(function() {
      $scope.flip($scope.cards[$scope.cards.length - 1]);
    }, 333);
  };

  $scope.deleteCard = function(card) {
    $("#card_" + card.id).removeClass("fadeInLeft").addClass("fadeOutLeft");
    $timeout(function() {
      $scope.cards.splice($scope.cards.indexOf(card), 1);
    }, 333);
  };

  $scope.lastTime = function(card) {
    return moment(card.history[card.history.length - 1]).fromNow();
  };

  $scope.nextTime = function(card) {
    return moment(new Date(card.history[card.history.length - 1]).getTime() + card.frequency).fromNow();
  };

  $scope.flip = function(card) {
    card.flipped = !card.flipped;
  };

  $scope.cardDone = function(card) {
    card.history.push(new Date());
    $scope.nextTime(card);
    $scope.lastTime(card);
  };

  // Get the next available card ID.
  $scope.nextCardId = function() {
    var maxCard = $scope.cards.reduce(function(initial, current, index) {
      return initial.id > current.id ? initial : current;
    });
    return maxCard.id + 1;
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
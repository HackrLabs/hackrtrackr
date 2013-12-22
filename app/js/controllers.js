'use strict';

var ctrls = angular.module('HakrTracker.controllers', 
    [ 'HakrTracker.services'
    ]
);

ctrls.controller('NavCtrl', function($scope, $location){
    $scope.isActive = function(route) {
        if (typeof route == "string") {
            return route === $location.path() ? true : false
        } else if (typeof route === "object") {
            return route.indexOf($location.path()) != -1 ? true : false;
        }
        return false;
    }
});

ctrls.controller('DashboardCtrl', function($scope){

});

ctrls.controller('MembersListCtrl', function($scope){

});

ctrls.controller('MembersNewCtrl', function($scope, HakrTrackerAPI){
    /* Card Types for Adding Cards */
    $scope.cardTypes = [];
    $scope.cardTypes.push({name: 'NFC', value: 'nfc'});
    $scope.cardTypes.push({name: 'RFID (HID)', value: 'rfid'});

    /* Member Info */
    $scope.member = {};

    $scope.member.cards = [];
    $scope.addCard = function(){
        var card = {};
        card.id = $scope.card.cardId;
        card.type = $scope.card.cardType;
        $scope.member.cards.push(card);
    };

    $scope.addMember = function(){
        HakrTrackerAPI.addMember($scope.member);
    }
})

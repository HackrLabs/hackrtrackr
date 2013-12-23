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

ctrls.controller('MembersListCtrl', function($scope, HakrTrackerAPI){
    HakrTrackerAPI.getMembers().then(function(members){
        $scope.members = members.data.response.members;
    });

    $scope.toggleActive = function(){
        if(this.isActive == 0) {
            this.isActive = 1
        } else {
            this.isActive = 0
        }
    }
});

ctrls.controller('MembersEditCtrl', function($scope, HakrTrackerAPI, $routeParams){
    var memberid = $routeParams.memberid
    HakrTrackerAPI.getMembers(memberid).then(function(members){
        console.log(members)
        $scope.member = members.data.response.members;
    });
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

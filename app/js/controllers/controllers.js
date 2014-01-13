'use strict';

var ctrls = angular.module('HakrTracker.controllers',
    [ 'HakrTracker.services'
    , 'HakrTracker.factories'
    , 'angular.css.injector'
    ]
);

ctrls.controller('AppCtrl', function($scope, breadcrumbs, $routeParams){
    $scope.breadcrumbs = breadcrumbs;
});

ctrls.controller('NavCtrl', function($scope, $location){
    var path = $location.path();
    path = path.substring(1);
    var pathArray = path.split('/');
    console.log($scope.merchant)
    $scope.isActive = function(route) {
        if (typeof route == "string") {
            return route === $location.path() ? true : false
        } else if (typeof route === "object") {
            return route.indexOf($location.path()) != -1 ? true : false;
        }
        return false;
    }
});

ctrls.controller('MerchantDashboardCtrl', function($scope, HakrTrackerAPI, $routeParams, cssInjector){
    var merchant = $routeParams.merchant;
    HakrTrackerAPI.getMembers({merchant: merchant}).then(function(members){
        console.log(members)
        $scope.memberCount = members.data.response.count;
    })
    cssInjector.add('/css/dash.css');
});
ctrls.controller('MembersListCtrl', function($scope, HakrTrackerAPI){
    HakrTrackerAPI.getMembers().then(function(members){
        $scope.members = members.data.response.members;
    });

    $scope.toggleActive = function(memberID, idx){
        HakrTrackerAPI.toggleMemberActivity(memberID).then(function(res){
            var response = res.data.response;
            $scope.members[idx] = response.members;
        })
    }
});

ctrls.controller('MembersEditCtrl', function($scope, HakrTrackerAPI, $routeParams, breadcrumbs){
    var memberid = $routeParams.memberid
    HakrTrackerAPI.getMembers(memberid).then(function(members){
        $scope.member = members.data.response.members[0];
    });
    /* Card Types for Adding Cards */
    $scope.cardTypes = [];
    $scope.cardTypes.push({name: 'NFC', value: 'nfc'});
    $scope.cardTypes.push({name: 'RFID (HID)', value: 'rfid'});

    $scope.addCard = function(){
        var card = {};
        card.cardid = $scope.card.cardId;
        card.cardtype = $scope.card.cardType;
        card.memberid = $scope.member.memberid;
        HakrTrackerAPI.addCard(card).then(function(res){
            var response = res.data;
            if(response.error != true) {
                card.id = response.response.cardID;
                $scope.member.cards.push(card);
                $scope.card = '';
            } else {
                console.log(response);
            }
        });
    };

    $scope.deleteCard = function(cardID, idx) {
        console.log('cardid: ' + cardID + ', index: ' + idx)
        HakrTrackerAPI.deleteCard(cardID).then(function(res){
            var response = res.data
            $scope.member.cards.splice(idx, 1);
        });
    }

    $scope.updateMember = function(){
        HakrTrackerAPI.updateMember($scope.member);
    }
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
        card.cardid = $scope.card.cardId;
        card.type = $scope.card.cardType;
        HakrTrackerAPI.addCard(card).then(function(response){
            if(response.error != true) {
                card.id = response.response.cardID;
                $scope.member.cards.push(card);
                console.log($scope.member.cards)
            } else {
                console.log(response)
            }
        });
    };

    $scope.addMember = function(){
        HakrTrackerAPI.addMember($scope.member);
    }
})

ctrls.controller('EmployeesCtrl', function($scope, HakrTrackerAPI){

});

ctrls.controller('EmployeesTimeCtrl', function($scope, HakrTrackerAPI){

});
ctrls.controller('LoginCtrl' , function($scope, HakrTrackerAPI, cssInjector){
    cssInjector.add("/css/unicorn-login.css");
});

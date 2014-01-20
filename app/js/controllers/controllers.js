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
    $scope.isActive = function(route) {
        if (typeof route == "string") {
            return route === $location.path() ? true : false
        } else if (typeof route === "object") {
            return route.indexOf($location.path()) != -1 ? true : false;
        }
        return false;
    }
});

ctrls.controller('DashboardCtrl', function($scope, HakrTrackerAPI, $routeParams, cssInjector){
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
				console.log('>>>> Members', $scope.members)
    });

    $scope.toggleActive = function(memberID, idx){
			console.log(memberID)
			HakrTrackerAPI.toggleMemberActivity(memberID).then(function(res){
				var response = res.data.response;
				$scope.members[idx] = response.members;
			})
    }

		$scope.deleteMember = function(memberID) {
			HakrTrackerAPI.deleteMember(memberID).then(function(res){
				$scope.members = res.data.response.members
			});
		}
});

ctrls.controller('MembersEditCtrl', function($scope, HakrTrackerAPI, $routeParams, breadcrumbs, $log){
	var memberid = $routeParams.memberid
	HakrTrackerAPI.getMemberById(memberid).then(function(members){
		$log.log('>>> Getting Member information', members)
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
				card.id = response.response.cardId;
				$scope.member.cards.push(card);
				$scope.card = '';
			} else {
				console.log(response);
			}
		});
	};

	$scope.deleteCard = function(cardId, idx) {
		console.log('cardid: ' + cardId + ', index: ' + idx)
		HakrTrackerAPI.deleteCard(cardId).then(function(res){
			var response = res.data
			$scope.member.cards.splice(idx, 1);
		});
	}

	$scope.updateMember = function(){
		HakrTrackerAPI.updateMember($scope.member).then(function(response){
			$scope.error = response.data.error;
			if(!$scope.error)
				$scope.member = response.data.response.member;
		});
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
			card.cardId = $scope.card.cardId;
			card.type = $scope.card.cardType;
			$scope.member.cards.push(card);
    };

    $scope.addMember = function(){
        HakrTrackerAPI.addMember($scope.member).then(function(response){
					console.log(response)
				});
    }
})

ctrls.controller('EmployeesCtrl', function($scope, HakrTrackerAPI){
	HakrTrackerAPI.getEmployees().then(function(res){
		$scope.employees = res.data.response.employees
	})
})

ctrls.controller('EmployeesTimeCtrl', function($scope, HakrTrackerAPI){

});
ctrls.controller('LoginCtrl' , function($scope, HakrTrackerAPI, cssInjector){
    cssInjector.add("/css/unicorn-login.css");
});

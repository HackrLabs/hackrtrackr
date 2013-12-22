'use strict';

var app = angular.module('HakrTracker', 
    [ 'ngRoute'
    , 'HakrTracker.controllers'
    ]
);

app.config(function($routeProvider){
    $routeProvider
    .when('/',
        { controller: 'DashboardCtrl'
        , templateUrl: 'partials/dashboard.html'
        }
    )
    .when('/members',
        { controller: 'MembersListCtrl'
        , templateUrl: 'partials/members/list.html'
        }
    )
    .when('/members/new',
        { controller: 'MembersNewCtrl'
        , templateUrl: 'partials/members/new.html'
        }
    )
    .otherwise({redirectTo: '/'});
});

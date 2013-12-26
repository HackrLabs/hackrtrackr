'use strict';

var app = angular.module('HakrTracker', 
    [ 'ngRoute'
    , 'HakrTracker.controllers'
    ]
);

app.config(function($routeProvider, $httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $routeProvider
    .when('/',
        { controller: 'DashboardCtrl'
        , templateUrl: 'partials/dashboard.html'
        }
    )
    .when('/login', 
        { controller: 'LoginCtrl'
        , templateUrl: 'partials/login/index.html'
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
    .when('/members/edit/:memberid',
        { controller: 'MembersEditCtrl'
        , templateUrl: 'partials/members/edit.html'
        }
    )
    .otherwise({redirectTo: '/'});
});

angular.module('myApp', ['angular.css.injector']);

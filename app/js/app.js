'use strict';

var app = angular.module('HakrTracker',
    [ 'ngRoute'
    , 'HakrTracker.controllers'
    ]
);

app.config(function($routeProvider, $httpProvider, $locationProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $locationProvider.html5Mode(true)
    $routeProvider
    .when('/login',
        { controller: 'LoginCtrl'
        , templateUrl: '/partials/login/index.html'
        }
    )
    .when('/',
        { controller: 'DashboardCtrl'
        , templateUrl: '/partials/dashboard.html'
        }
    )
    .when('/members',
        { controller: 'MembersListCtrl'
        , templateUrl: '/partials/members/list.html'
        }
    )
    .when('/members/new',
        { controller: 'MembersNewCtrl'
        , templateUrl: '/partials/members/new.html'
        }
    )
    .when('/members/edit/:memberid',
        { controller: 'MembersEditCtrl'
        , templateUrl: '/partials/members/edit.html'
        }
    )
    .when('/employees',
        { controller: 'EmployeesCtrl'
        , templateUrl: '/partials/employees/list.html'
        }
    )
    .when('/employees/timesheet',
        { controller: 'EmployeeTimeCtrl'
        , templateUrl: 'partials/employees/time-dashboard.html'
        }
    )
    .otherwise({redirectTo: '/login'});
});

angular.module('myApp', ['angular.css.injector']);

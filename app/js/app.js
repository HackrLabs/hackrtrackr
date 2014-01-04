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
    .when('/:merchant',
        { controller: 'DashboardCtrl'
        , templateUrl: '/partials/dashboard.html'
        }
    )
    .when('/login', 
        { controller: 'LoginCtrl'
        , templateUrl: '/partials/login/index.html'
        }
    )
    .when('/:merchant/members',
        { controller: 'MembersListCtrl'
        , templateUrl: '/partials/members/list.html'
        }
    )
    .when('/:merchant/members/new',
        { controller: 'MembersNewCtrl'
        , templateUrl: '/partials/members/new.html'
        }
    )
    .when('/:merchant/members/edit/:memberid',
        { controller: 'MembersEditCtrl'
        , templateUrl: '/partials/members/edit.html'
        }
    )
    .when('/:merchant/employees',
        { controller: 'EmployeesCtrl'
        , templateUrl: '/partials/employees/list.html'
        }    
    )
    .when('/employees/timesheet',
        { controller: 'EmployeeTimeCtrl'
        , templateUrl: 'partials/employees/time-dashboard.html'
        }    
    )
    .otherwise({redirectTo: '/:merchant'});
});

angular.module('myApp', ['angular.css.injector']);

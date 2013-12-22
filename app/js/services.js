'use strict';

//var host = "http://api.hakrtracker.io";
var host = "http://hakrtracker.dev/api";

var services = angular.module('HakrTracker.services', []);

services.service('HakrTrackerAPI', function($http){
    function load(path, params) {
        params = params || {};
        params.callback = "JSON_CALLBACK";
        return $http.jsonp(host + path, {params: params});
    } 
    function post(path, params) {
        params = params || {};
        return $http.post(host + path, params);
    }

    return {
        getMembers: function(type, params){
            return load('/members/', params)
        },
        addMember: function(data){
            return post('/members/add/', data);
        }
    }
});

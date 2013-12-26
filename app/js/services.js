'use strict';

var host = "http://api.hakrtracker.dev/api";
//var host = "http://hakrtracker.dev/api";

var services = angular.module('HakrTracker.services', []);

services.service('HakrTrackerAPI', function($http){
    function load(path, params) {
        params = params || {};
        params.callback = "JSON_CALLBACK";
        return $http.jsonp(host + path, {params: params});
    } 
    function post(path, params) {
        params = params || {};
        var config =  {}
        return $http.post(host + path, params, config);
    }
    function del(path) {
        return $http.delete(host + path);
    }

    return {
        getMembers: function(type, params){
            type = type || '';
            return load('/members/' + type, params)
        },
        addMember: function(data){
            return post('/members/add/', data)
        },
        updateMember: function(data){
            return post('/members/update/', data)
        },
        addCard: function(data) {
            return post('/members/cards/add', data)
        },
        deleteCard: function(cardID) {
            return del('/members/cards/remove/' + cardID)
        }
    }
});


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

		function put(path) {
			return $http.put(host + path)
		}

    return {
        getMembers: function(params){
            return load('/members/', params)
        },
				getMemberById: function(memberID) {
					return load('/members/' + memberID)
				},
        addMember: function(data){
            return post('/members/add/', data)
        },
        updateMember: function(data){
            return post('/members/update/', data)
        },
        deleteMember: function(memberID) {
            return del('/members/remove/' + memberID)
        },
        toggleMemberActivity: function(memberID) {
            return post('/members/toggleEnabled/' + memberID)
        },
        addCard: function(data) {
            return post('/members/cards/add', data)
        },
        deleteCard: function(cardID) {
            return del('/members/cards/remove/' + cardID)
				},
				getEmployees: function(params) {
					return load('/employees/', params)
        }
    }
});

services.service('ModalService', function(){
	var modal = {};
	/**
	 * Creates a modal with the appropriate information
	 * @public
	 * @returns {undefined}
	 */
	modal.createModal = function() {

	}

	/**
	 * Displays the modal to the screen
	 * @private
	 * @returns {undefined}
	 */
	function showModal() {

	}

	/**
	 * Hides the modal from the screen
	 * @private
	 * @returns {undefined}
	 */
	function hideModal() {

	}

	return modal
})


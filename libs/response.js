'use strict';

/**
 * Function for Creating JSON Responses
 * @function createResponse
 * @param {object || string} msg - An object or string that will be returned as
 * response
 * @param {boolean} err - Is it an error
 * @return {object} response - Response JSON
 */
var createResponse = function(msg, err) {
    var response = {};
    response.error = err || false;
    response.response = msg;
    return response;
}

module.exports = 
{ createResponse: createResponse
};

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

/**
 * A function for taking sending JSON objects to the requesting client
 * @function respondToClient
 * @param {object} res - expressJS response object
 * @param {object} options - options to decide type of response and jsonp
 * callback
 * @param {object} responseObject - Object being sent to client via res
 */
var respondToClient = function(res, options, responseObject){
    if(typeof options.format != "undefined" && options.format != null) {
        res.send(responseObject);
    } else {
        res.send(options.callback + '(' + JSON.stringify(responseObject) + ')');
    }
}

module.exports = 
{ createResponse: createResponse
, respondToClient: respondToClient
};

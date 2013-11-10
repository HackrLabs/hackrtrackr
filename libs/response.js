'use strict';

var createResponse = function(msg, err) {
    var response = {};
    response.error = err || false;
    response.response = msg;
    return response;
}

module.exports = 
{ createResponse: createResponse
};

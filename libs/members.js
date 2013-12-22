'use strict';

var bookshelf = require('./dbconn').DATABASE,
    config = require('./config'),
    redis = require('redis'),
    response = require('./response');

// Create a Redis Client
var redisClient = redis.createClient();

// Display Redis Errors if any arise
redisClient.on('error', function(err){
        err = 'Error Connection to NoSQL Database';
        var responseOptions = {};
        responseOptions.callback = req.query.callback || '';
        responseOptions.format = req.query.format || null;
        var errorResponse = response.createResponse(err, true);
        respondToClient(res, responseOptions, errorResponse);
});

var Member = bookshelf.Model.extend(
    { tableName: 'members'
    }
)

var getAllMembers = function(req, res) {

};

var getMemberById = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    var id = req.route.params.id;
    Member.get(id, function(err, member){
        if (err) throw err;
        var members = {};
        members.member = member;
        redisClient.set("members." + id, JSON.stringify(member));
        redisClient.expire("members." + id, config.redis.expire);
        var apiServiceResponse = response.createResponse(members);
        response.respondToClient(res, responseOptions, apiServiceResponse);
    });  
};

var addMember = function(req, res) {
    console.log(req.body);
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    var apiServiceResponse = response.createResponse('Under Development', true);
    response.respondToClient(res, responseOptions, apiServiceResponse);
}

module.exports = 
    { Member: Member
    , getById: getMemberById
    , getAll: getAllMembers
    , addMember: addMember
    };

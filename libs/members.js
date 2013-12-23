'use strict';

var bookshelf = require('./dbconn').DATABASE,
    config = require('./config'),
    redis = require('redis'),
    response = require('./response'),
    cards = require('./cards');

// Create a Redis Client
var redisClient = redis.createClient();

var Member = bookshelf.Model.extend(
    { tableName: 'members'
    , idAttribute: 'memberid'
    , cards: function(){
            return this.hasMany(cards.Card, 'memberid')
        }
    }
);

var Members = bookshelf.Collection.extend(
    { model: Member
    }
)

var getAllMembers = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    var id = req.route.params.id;
    new Members()
        .fetch({withRelated: ['cards']})
        .then(function(members){
            var apiServiceResponse = response.createResponse({members: members});
            response.respondToClient(res, responseOptions, apiServiceResponse);
        });  
};

var getMemberById = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    var id = req.route.params.id;
    new Member({memberid: id})
        .fetch({withRelated: ['cards']})
        .then(function(member){
            var apiServiceResponse = response.createResponse({members: member});
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

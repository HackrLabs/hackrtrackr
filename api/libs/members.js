'use strict';

var bookshelf = require('./dbconn').DATABASE,
    config = require('./config'),
    redis = require('redis'),
    response = require('./response'),
    cards = require('./cards'),
    _ = require('underscore'),
    when = require('when'),
    Promise = require('bluebird');

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
    Member.forge({id: 13849})
        .save(req.body)
        .then(function(member){
            console.log('New Member Created, ' + JSON.stringify(member))
        }) 
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    var apiServiceResponse = response.createResponse('Under Development', true);
    response.respondToClient(res, responseOptions, apiServiceResponse);
}

var updateMember = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;

    var memberData = req.body;
    var memberID = memberData.memberid;
    var memberCards = memberData.cards;
    delete memberData.cards;
    console.log('Creating Member ' + memberID);
    var member = new Member({memberid: memberID});
    member
        .save(memberData, {patch: true})
        .then(function(member){
            console.log('Member updated mother fucker')
        })
        .otherwise(function(err){
            console.log('Could not update member', err);
        })
    if(memberCards.length > 1){
        console.log(memberCards.length) 
        var cardCollection = cards.CardCollection.forge(memberCards);
        console.log(JSON.stringify(cardCollection))
        cardCollection.invokeThen('save', null).then(function() {
            console.log('Cards Saved')
        });
    } else {
        var card = new cards.Card(memberCards);
        card
            .save(memberCards, {patch: true})
            .then(function(){
                console.log('Card updated')
            })
            .otherwise(function(er){
                console.log('Fucking single card', err)
            })
    }
}

module.exports = 
    { Member: Member
    , getById: getMemberById
    , getAll: getAllMembers
    , addMember: addMember
    , updateMember: updateMember
    };

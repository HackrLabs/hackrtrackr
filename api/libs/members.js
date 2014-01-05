'use strict';

var bookshelf,
    config = require('./config'),
    redis = require('redis'),
    response = require('./response'),
    cards = require('./cards'),
    master = require('./master')
// Create a Redis Client
var redisClient = redis.createClient();
var Member, Members;

var initializeModels = function(merchant, callback){
    master.checkMerchantExistance(merchant, function(connection){
        connection.couldNotFind = connection.couldNotFind || false

        if(!connection.couldNotFind) {
            bookshelf = connection
            Member = bookshelf.Model.extend(
                { tableName: 'members'
                , idAttribute: 'memberid'
                , cards: function(){
                        return this.hasMany(cards.Card, 'memberid')
                    }
                }
            );

            Members = bookshelf.Collection.extend(
                { model: Member
                }
            )
        }
        if(typeof callback == "function") {
            callback.call(this, bookshelf.couldNotFind)
        }
    })
}
var getAllMembers = function(req, res) {
    var merchant = req.query.merchant
    initializeModels(merchant, function(err){
        if (err) { res.send('fuck there is an error')}
        var responseOptions = {};
        responseOptions.callback = req.query.callback || '';
        responseOptions.format = req.query.format || null;
        var id = req.route.params.id;
        new Members()
            .fetch()
            .then(function(members){
                var apiServiceResponse = response.createResponse({members: members, count: members.length});
                response.respondToClient(res, responseOptions, apiServiceResponse);
            })
            .otherwise(function(err){
                console.error(err)
            })
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
            var members = [];
            members.push(member)
            var apiServiceResponse = response.createResponse({members: members});
            response.respondToClient(res, responseOptions, apiServiceResponse);
        });  
};

var addMember = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    
    var memberData = req.body;
    var memberID = memberData.memberid;
    var memberCards = memberData.cards;
    delete memberData.cards;
    var member = new Member();
    member
        .save(memberData, {patch: true})
        .then(function(member){
            if(memberCards.length > 1){
                console.log(memberCards.length) 
                var cardCollection = cards.CardCollection.forge(memberCards);
                console.log(JSON.stringify(cardCollection))
                cardCollection.invokeThen('save', null).then(function() {
                    var apiServiceResponse = response.createResponse({msg: 'success'});
                    response.respondToClient(res, responseOptions, apiServiceResponse);
                });
            } else {
                var card = new cards.Card(memberCards);
                card
                    .save(memberCards, {patch: true})
                    .then(function(){
                        var apiServiceResponse = response.createResponse({msg: 'success'});
                        response.respondToClient(res, responseOptions, apiServiceResponse);
                    })
                    .otherwise(function(er){
                        var apiServiceResponse = response.createResponse({msg: 'failed', err: err.client});
                        response.respondToClient(res, responseOptions, apiServiceResponse);
                    })
            }
        })
        .otherwise(function(err){
            var apiServiceResponse = response.createResponse({msg: 'failed', err: err.clientError});
            response.respondToClient(res, responseOptions, apiServiceResponse);
        })
    
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

var removeMember = function(req, res) {

};

var toggleEnabled = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    
    var id = req.params.id;
    new Member()
        .fetch({memberid: id})
        .then(function(member){
            delete member.cards
            member.set('isactive', false);
            console.log(member)
            member
                .save({isActive: member.isactive === true ? false : true}, {patch: true})
                .then(function(member){
                    console.log(member)
                    var members = []
                    members.push(member)
                    var apiServiceResponse = response.createResponse({msg: 'success', members: members});
                    response.respondToClient(res,responseOptions,apiServiceResponse);
                })
                .otherwise(function(err){
                    var apiServiceResponse = response.createResponse({msg: 'failed', err: err}, true);
                    response.respondToClient(res,responseOptions,apiServiceResponse);
                })
        })
}

module.exports = 
    { Member: Member
    , getById: getMemberById
    , getAll: getAllMembers
    , addMember: addMember
    , updateMember: updateMember
    , removeMember: removeMember
    , toggleEnabled: toggleEnabled
    };

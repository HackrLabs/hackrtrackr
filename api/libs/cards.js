'use strict';

var bookshelf = require('./dbconn').DATABASE,
	bkshlfEvents = require('bookshelf').Events,
	response = require('./response'),
    config = require("./config");
var Card = bookshelf.Model.extend(
    { tableName: 'cards'
    , idAttribute: 'id'
    , member: function(){
            return this.belongsTo(Member)
        }
    }    
);

var CardCollection = bookshelf.Collection.extend(
    { model: Card
    }
);

var addCard = function(req, res) {
    Card.forge()
		.save(req.body)
		.then(function(card){
            console.log(card)
            var apiServiceResponse = response.createResponse({msg: 'success', cardID: card.id})
            response.respondToClient(res, {format: config.app.stockResponse}, apiServiceResponse);
		})
		.otherwise(function(err){
            console.log(err)
            var apiServiceResponse = response.createResponse({msg: 'failed', err: err.clientError}, true);
            response.respondToClient(res, {format: config.app.stockResponse}, apiServiceResponse);
		})
}

var removeCard = function(req, res) {
	var cardID = req.params.id;
    console.log(cardID)
    new Card({id: cardID})
        .fetch()
        .then(function(card){
            console.log("The card, id: " + card.id)
            card.on('destroyed', function(){
                console.log('Card Destroyed')
            })
            card.on('destroying', function(something){
                console.log('Destroying ' + something.id);
            })
            card
                .destroy()
                .then(function(){
                    var apiServiceResponse = response.createResponse({msg: 'success'});
                    response.respondToClient(res, {format: 'json'}, apiServiceResponse);
                })
                .otherwise(function(err){
                    console.log(err)
                })
		});
}

module.exports = 
{ Card: Card
, CardCollection: CardCollection 
, addCard: addCard
, removeCard: removeCard
};

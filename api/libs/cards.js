'use strict';

var bookshelf = require('./dbconn').DATABASE,
	bkshlfEvents = require('bookshelf').Events,
	response = require('./response');

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
	Card.forge(req.body)
		.save()
		.then(function(){
			console.log('Card added')
		})
		.otherwise(function(err){
			console.log('Card failed', err);
		})
}

var removeCard = function(req, res) {
	var card = req.body;
	new Card()
//		.query('where', 'id', '=', card.id)
        .fetch({id: card.id})
        .then(function(card){
            console.log(card)
			/*
            card.destroy().then(function(){
				console.log('The deed is done')
			})
            */
		});
}

module.exports = 
{ Card: Card
, CardCollection: CardCollection 
, addCard: addCard
, removeCard: removeCard
};

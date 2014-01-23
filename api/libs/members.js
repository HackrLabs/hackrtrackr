'use strict';

var bookshelf = require('./dbconn').DATABASE,
    config = require('./config'),
    redis = require('redis'),
    response = require('./response'),
    cards = require('./cards'),
		async = require('async');

// Create a Redis Client
var redisClient = redis.createClient();
/**
 * Creates a Member
 */
var Member = bookshelf.Model.extend(
    { tableName: 'members'
    , idAttribute: 'memberid'
    , cards: function(){
				return this.hasMany(cards.Card, 'memberid')
			}
    }
);
/**
 * Creates a Member Collection
 * @constructor
 */
var Members = bookshelf.Collection.extend(
    { model: Member
    }
);

/**
 * Gets all of the members and their related information from the database and
 * returns to browser
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
var getAll = function(req, res) {
	var responseOptions = {};
	responseOptions.callback = req.query.callback || '';
	responseOptions.format = req.query.format || null;
	var id = req.route.params.id;
	new Members()
		.fetch({withRelated: ['cards']})
		.then(function(members){
			var apiServiceResponse = response.createResponse({members: members, count: members.length});
			response.respondToClient(res, responseOptions, apiServiceResponse);
		});
};

/**
 * Gets a single member from the database based on memberid and returns to
 * browser
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
var getById = function(req, res) {
	var responseOptions = {};
	responseOptions.callback = req.query.callback || '';
	responseOptions.format = req.query.format || null;
	var memberID = req.route.params.memberid;
	new Member({memberid: memberID})
		.fetch({withRelated: ['cards']})
		.then(function(member){
			var members = [];
			members.push(member)
			var apiServiceResponse = response.createResponse({members: members});
			response.respondToClient(res, responseOptions, apiServiceResponse);
		});
};

/**
 * Recieves information from POST request and adds a new member to the database
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
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
			var apiServiceResponse = response.createResponse({msg: 'success'})
			response.respondToClient(res, res.responseOptions, apiServiceResponse)
		})
		.otherwise(function(err){
			var apiServiceResponse = response.createResponse({msg: 'failed', err: err.clientError});
			response.respondToClient(res, res.responseOptions, apiServiceResponse);
		})

}

/**
 * Updates a member that exists in the database from a POST request
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
var updateMember = function(req, res) {
	var memberData = req.body;
	var memberID = memberData.memberid;
	var memberCards = memberData.cards;
	delete memberData.cards;
	var member = new Member({memberid: memberID});
	member
		.save(memberData, {patch: true})
		.then(function(mem){
			// Update Cards
			updateMemberCards(memberCards, function(err){
				if(err) {
					var apiServiceResponse = response.createResponse({msg: 'failed', error: err}, true)
				} else {
					var apiServiceResponse = response.createResponse({msg: 'success', member: mem})
				}
				response.respondToClient(res, res.responseOptions, apiServiceResponse);
			})
		})
		.otherwise(function(err){
				var apiServiceResponse = response.createResponse({msg: 'failed', error: err}, true)
				response.respondToClient(res, res.responseOptions, apiServiceResponse);
		})
}

/**
 * Removes a user from the database via a DELETE request
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
var removeMember = function(req, res) {
	var memberID = req.params.memberid
	console.log(memberID)
	new Member({memberid: memberID})
		.destroy()
		.then(function(mem){
			new Members()
				.fetch()
				.then(function(allMembers){
					var apiServiceResponse = response.createResponse({msg: 'success', members: allMembers})
					response.respondToClient(res, res.responseOptions, apiServiceResponse);
				})
		})
		.otherwise(function(err){
			var apiServiceResponse = response.createResponse({msg: 'failed', error: err}, true);
			response.respondToClient(res, res.responseOptions, apiServiceResponse)
		})
};

/**
 * Toggles weather a user is active or inactive via a POST request
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
var toggleEnabled = function(req, res) {
	var responseOptions = {};
	responseOptions.callback = req.query.callback || '';
	responseOptions.format = req.query.format || null;

	var id = req.params.memberid;
	new Member({memberid: id})
		.fetch()
		.then(function(member){
			delete member.cards
		var	isActive = (member.get('isactive') == true ? false : true);
			member.set('isactive', isActive);
			member
				.save()
				.then(function(mem){
						var apiServiceResponse = response.createResponse({msg: 'success', members: mem});
						response.respondToClient(res, responseOptions, apiServiceResponse);
				})
				.otherwise(function(err){
					var apiServiceResponse = response.createResponse({msg: 'failed', err: err, member: member}, true);
					response.respondToClient(res,responseOptions,apiServiceResponse);
				})
		})
};

var updateMemberCards = function(cards, callback) {
	async.forEach(cards, function(memberCard, cb){
		if (memberCard.cardType == 'rfid' && typeof memberCard.card == Number) {
			memberCard.card = cards.convertCardToHex(memberCard.card)
		}
		var card = new cards.Card(memberCard);
		card
			.save(memberCard, {patch: true})
			.then(function(){
				cb();
			})
			.otherwise(function(err){
				cb(err);
			})
	}, function(err) {
		if(typeof callback == "function"){
			callback.call(this, err)
		}
	})
}

module.exports =
{ Member: Member
, Members: Members
, add: addMember
, remove: removeMember
, toggleEnabled: toggleEnabled
, getAll: getAll
, getById: getById
, update: updateMember
};

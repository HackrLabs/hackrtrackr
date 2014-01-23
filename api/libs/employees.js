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
 * Creates a Employee
 */
var Employee = bookshelf.Model.extend(
    { tableName: 'members'
    , idAttribute: 'memberid'
    , cards: function(){
				return this.hasMany(cards.Card, 'memberid')
			}
    }
);
/**
 * Creates a Employee Collection
 * @constructor
 */
var Employees = bookshelf.Collection.extend(
    { model: Employee
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
	new Employees()
		.query('where', 'isemployee', '=', 'true')
		.fetch()
		.then(function(employees){
			var apiServiceResponse = response.createResponse({msg: 'success', employees: employees});
			response.respondToClient(res, responseOptions, apiServiceResponse);
		})
		.otherwise(function(err){
			var apiServiceResponse = response.createResponse({msg: 'failed', error: err}, true);
			response.respondToClient(res, responseOptions, apiServiceResponse);
		})
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
	new Employee({memberid: memberID})
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
var addEmployee = function(req, res) {
	var responseOptions = {};
	responseOptions.callback = req.query.callback || '';
	responseOptions.format = req.query.format || null;

	var memberData = req.body;
	var memberID = memberData.memberid;
	var memberCards = memberData.cards;
	delete memberData.cards;
	var member = new Employee();
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
var updateEmployee = function(req, res) {
	var memberData = req.body;
	var memberID = memberData.memberid;
	var memberCards = memberData.cards;
	delete memberData.cards;
	var member = new Employee({memberid: memberID});
	member
		.save(memberData, {patch: true})
		.then(function(mem){
			// Update Cards
			updateEmployeeCards(memberCards, function(err){
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
var removeEmployee = function(req, res) {
	var memberID = req.params.memberid
	console.log(memberID)
	new Employee({memberid: memberID})
		.destroy()
		.then(function(mem){
			new Employees()
				.fetch()
				.then(function(allEmployees){
					var apiServiceResponse = response.createResponse({msg: 'success', members: allEmployees})
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
	new Employee({memberid: id})
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


module.exports =
{ Employee: Employee
, Employees: Employees
, add: addEmployee
, remove: removeEmployee
, toggleEnabled: toggleEnabled
, getAll: getAll
, getById: getById
, update: updateEmployee
};

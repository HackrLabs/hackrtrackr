var pg = require('pg'),
    async = require('async'),
    config = require('./config'),
    items = require('./items'),
    redis = require('redis'),
    response = require('./response'),
    bookshelf = require('./dbconn').DATABASE;

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
})

if(typeof bookshelf != "undefined") {
var Area = bookshelf.Model.extend(
    { tableName: 'areas'
    , items: function(){
            return this.hasMany(items.Item)
        }
    }    
);

var Areas = bookshelf.Collection.extend(
    { model: Area
    }    
)
}
/**
 * Retreives all Areas, Items and Tickets
 * @function findAll
 * @param {object} req - expressJS request object
 * @param {object} res - expressJS response object
 */
var findAll = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;

    redisClient.get("areas.all", function(err, reply){
        if(err) {
            err = 'Error Querying NoSQL Database for All Areas';
            var errorResponse = response.createResponse(err, true);
            respondToClient(res, responseOptions, errorResponse);
        } else if(reply === null) {
            new Areas()
                .fetch({withRelated: ['items', 'items.tickets', 'items.caveats', 'items.contacts']})
                .then(function(areas){
                    redisClient.set("areas.all", JSON.stringify(areas))
                    var apiServiceResponse = response.createResponse({areas: areas})
                    response.respondToClient(res, responseOptions, apiServiceResponse);
                })
        } else {
            var areas = JSON.parse(reply);
            var apiServiceResponse = response.createResponse({areas: areas});
            response.respondToClient(res, responseOptions, apiServiceResponse);
        }
    });
}
/**
 * Retreives Area, Items and Tickets by Id
 */
var getById = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    var id = req.route.params.id;

    redisClient.get("areas." + id, function(err, reply){
        if(err) {
            err = 'Error Querying NoSQL Database for Area: ' + id;
            var errorResponse = response.createResponse(err, true);
            respondToClient(res, responseOptions, errorResponse);
        } else if(reply === null) {
            var id = req.route.params.id;
             new Area({id: id})
                .fetch({withRelated: ['items', 'items.tickets', 'items.caveats', 'items.contacts']})
                .then(function(area){
                    var areas = [];
                    areas.push(area);
                    redisClient.set("areas." + id, JSON.stringify(area));
                    var apiServiceResponse = response.createResponse({areas: areas})
                    response.respondToClient(res, responseOptions, apiServiceResponse);
                });
        } else {
            var area = JSON.parse(reply);
            var areas = [];
            areas.push(area)
            var apiServiceResponse = response.createResponse({areas: areas});
            response.respondToClient(res, responseOptions, apiServiceResponse);
        }
    });
}

module.exports = 
    { findAll: findAll
    , getById: getById
    , Area: Area
    , Areas: Areas
    };

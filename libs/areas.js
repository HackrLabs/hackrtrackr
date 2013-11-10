var pg = require('pg'),
    async = require('async'),
    config = require('./config.js'),
    uniqueItems = require('./unique_items'),
    caveats = require('./caveats'),
    redis = require('redis'),
    response = require('./response.js');

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

// Create PG Connection String and Client
var pgConn = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" + config.postgres.host + "/" + config.postgres.database;
var pgClient = new pg.Client(pgConn);

// Connect to Postgres Database
pgClient.connect(function(err) {
    if(err) {
        err = 'Error Connecting to Relational Database';
        var responseOptions = {};
        responseOptions.callback = req.query.callback || '';
        responseOptions.format = req.query.format || null;
        var errorResponse = response.createResponse(err, true);
        respondToClient(res, responseOptions, errorResponse);
    } else {
        console.log('Connect to Hacker Tracker');
    }
});

/**
 * Function for Querying Postgres and Retrieving Area Data
 * @function queryPostgresForAreas
 * @param {string} query - Query String for Postgres
 * @param {object} pgClient - pgClient object
 * @param {object} res - expressJS response object
 * @callback {function} callback function for sending area(s) response
 *
 */
var queryPostgresForAreas = function(query, pgClient, res, callback) {
    pgClient.query(query, function(err, areas) {
        if(err) {
            console.error('Error Querying Hacker Tracker', err);
            callback({error: 1, errorMsg: 'Error Querying Relational Database'});
        }

        var allAreas = areas.rows;
        uniqueItems.getUniqueItems(pgClient, res, allAreas, function(AreaInfoWithoutCaveats) {
            // Get the Caveats
            caveats.getCaveats(pgClient, res, AreaInfoWithoutCaveats, function(fullAreaInfo){
                var areas_with_items = {};
                areas_with_items.areas = fullAreaInfo;
                if(typeof callback === "function") {
                    callback(areas_with_items);
                }
            });
        });
    });
}

/**
 * A function for taking sending JSON objects to the requesting client
 * @function respondToClient
 * @param {object} res - expressJS response object
 * @param {object} options - options to decide type of response and jsonp
 * callback
 * @param {object} responseObject - Object being sent to client via res
 */
var respondToClient = function(res, options, responseObject){
    if(typeof options.format != "undefined" || options.format != null) {
        res.send(responseObject);
    } else {
        res.send(options.callback + '(' + JSON.stringify(responseObject) + ')');
    }
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
            var pgQueryFindAll = "SELECT * FROM areas";
            queryPostgresForAreas(pgQueryFindAll, pgClient, res, function(allAreas){
                if(typeof allAreas.error != "undefined") {
                    var apiServiceResponse = response.createResponse(errMsg, true);
                } else {
                    redisClient.set("areas.all", JSON.stringify(allAreas));
                    redisClient.expire("areas.all", config.redis.expire);
                    var apiServiceResponse = response.createResponse(allAreas);
                }
                respondToClient(res, responseOptions, apiServiceResponse);
            });
        } else {
            var apiServiceResponse = response.createResponse(JSON.parse(reply));
            respondToClient(res, responseOptions, apiServiceResponse);
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
            var pgQueryFindById = "SELECT * from areas WHERE id='"  + id + "'";
            queryPostgresForAreas(pgQueryFindById, pgClient, res, function(area){
                if(typeof area.error != "undefined") {
                    var apiServiceResponse = response.createResponse(errMsg, true);
                } else {
                    redisClient.set("areas." + id, JSON.stringify(area));
                    redisClient.expire("areas." + id, config.redis.expire);
                    var apiServiceResponse = response.createResponse(area);
                }
                respondToClient(res, responseOptions, apiServiceResponse);
            });
        } else {
            var apiServiceResponse = response.createResponse(JSON.parse(reply))
            respondToClient(res, responseOptions, apiServiceResponse);
        }
    });
}

module.exports = 
    { findAll: findAll
    , getById: getById
    };

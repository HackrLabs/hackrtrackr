var pg = require('pg'),
    async = require('async'),
    config = require('./config'),
    items = require('./items'),
    tickets = require('./tickets'),
    caveats = require('./caveats'),
    redis = require('redis'),
    response = require('./response.js'),
    orm = require('orm');


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
//var pgClient = new pg.Client(pgConn);
var db = orm.connect(pgConn);

db.on("connect", function(err){
    if(err) {
        console.log("Could not connect to relational database");
        return;
    }
});

var Area = db.define('areas', 
    { id: { type: "number" }
    , name: { type: "text" }
    , desc: { type: "text" }
    , created_at: { type: "date" }
    , updated_at: { type: "date" }
    , photo_file_name: { type: "text" }
    , photo_content_type: { type: "text" }
    , photo_file_size: { type: "number" }
    , sequence: { type: "number" }
    },
    { methods: 
        {
            getName: function(){
                return this.name;
            }
        }
    }
);


Area.hasMany("items", items.Item);

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
 * @function getItemsTicketsAndCaveats
 * @param {object} areas - Areas
 * @param {function} callback - Callback Function
 */
var getItemsTicketsAndCaveats = function(area, callback) {
    items.item.find({area_id: area.id}, function(err, areaItems){
        async.eachSeries(areaItems, function(item, itemCallback){
            tickets.ticket.find({item_id: item.id}, function(err, itemTickets){
                if (err) throw err;
                item.tickets = itemTickets || [];
                caveats.caveats.find({item_id: item.id}, function(err, itemCaveats){
                    if (err) throw err;
                    item.caveats = itemCaveats || [];
                    itemCallback();
                });
            });
        }, function(){ 
            area.items = areaItems;
            if(typeof callback == "function") {
                callback.call(this, area);
            }
        });
    }); 
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
            db.driver.execQuery("SELECT * FROM areas", function(err, allAreas){
                if (err) throw err;
                async.eachSeries(allAreas, function(area, areaCallback){
                    getItemsTicketsAndCaveats(area, function(returnedArea){
                       area = returnedArea; 
                       areaCallback();
                    });
                }, function(){
                    var areas = {};
                    areas.area = allAreas;
                    redisClient.set("areas.all", JSON.stringify(allAreas));
                    redisClient.expire("areas.all", config.redis.expire);
                    var apiServiceResponse = response.createResponse(areas)
                    response.respondToClient(res, responseOptions, apiServiceResponse);
                });
            })
        } else {
            var areas = {};
            areas.area = JSON.parse(reply);
            var apiServiceResponse = response.createResponse(areas);
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
            Area.get(id, function(err, area){
                if (err) throw err;
                getItemsTicketsAndCaveats(area, function(area){
                    var areas = {}
                    areas.area = area;
                    redisClient.set("areas." + id, JSON.stringify(area));
                    redisClient.expire("areas." + id, config.redis.expire);
                    var apiServiceResponse = response.createResponse(areas)
                    response.respondToClient(res, responseOptions, apiServiceResponse);
                });
            });
        } else {
            var areas = {};
            areas.area = JSON.parse(reply);
            var apiServiceResponse = response.createResponse(areas);
            response.respondToClient(res, responseOptions, apiServiceResponse);
        }
    });
}

module.exports = 
    { findAll: findAll
    , getById: getById
    };

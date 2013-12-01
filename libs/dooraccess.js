var pg = require('pg'),
    async = require('async'),
    config = require('./config'),
    response = require('./response'),
    orm = require('orm'),
    redis = require('redis');
    
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
});

var pgConn = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" + config.postgres.host + "/" + config.postgres.database;
var db = orm.connect(pgConn);
db.on("connect", function(err){
    if(err){
        console.log("Could not connect to relational database");
        return;
    }
});

var doorAccess = db.define('labaccess',
    { memberid: "number"
    , logintime: "date"
    , description: "text"
    },
    { id: "memberid"
    , methods: 
        { getFullName: function() 
            {

            }
        }
    }
);

var getAll = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    
    db.driver.execQuery("SELECT * FROM labaccess", function(err, access){
        if (err) throw err;
        var accessResponse = {};
        accessResponse.doorAccess = access;
        redisClient.set("doorAccess.all", JSON.stringify(access));
        redisClient.expire("doorAccess.all", config.redis.expire);
        var apiServiceResponse = response.createResponse(access)
        response.respondToClient(res, responseOptions, apiServiceResponse);
    });
}

var getByMemberId = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    var id = req.route.params.id;
    
    doorAccess.find({memberid: id}, function(err, access){
        if (err) throw err;
        var accessResponse = {};
        accessResponse.doorAccess = access;
        redisClient.set("doorAccess." + id, JSON.stringify(access));
        redisClient.expire("doorAccess." + id, config.redis.expire);
        var apiServiceResponse = response.createResponse(access)
        response.respondToClient(res, responseOptions, apiServiceResponse);
    });
}

module.exports = 
    { getAll: getAll
    , getByMemberId: getByMemberId
    };

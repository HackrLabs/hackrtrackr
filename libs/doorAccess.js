var response = require('./response'),
    bookshelf = require('./dbconn').DATABASE,
    redis = require('redis'),
    config = require('./config');
    
// Create a Redis Client
var redisClient = redis.createClient();

var DoorAccess = bookshelf.Model.extend(
    { tableName: 'labaccess'
    }
)

var DoorAccessCollection = bookshelf.Collection.extend(
    { model: DoorAccess
    }
)

var getAll = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    new DoorAccessCollection()
        .fetch()
        .then(function(access){
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
    new DoorAccessCollection()
        .query()
        .where({memberid: id})
        .select()
        .then(function(access){
            var accessResponse = {};
            accessResponse.doorAccess = access;
            redisClient.set("doorAccess." + id, JSON.stringify(access));
            redisClient.expire("doorAccess." + id, config.redis.expire);
            var apiServiceResponse = response.createResponse(access)
            response.respondToClient(res, responseOptions, apiServiceResponse);
        })
}

module.exports = 
    { getAll: getAll
    , getByMemberId: getByMemberId
    };

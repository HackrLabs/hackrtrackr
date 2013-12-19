'use strict';

var orm = require('orm'),
    config = require('./config'),
    redis = require('redis'),
    response = require('./response');

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

var Member = db.define("members",
    { memberid: 
        { type: "number"
        , unique: true
        }
    , firstname: 
        { type: "text"
        , size: 50
        }
    , lastname: 
        { type: "text"
        , size: 50
        }
    , emailaddress: 
        { type: "text"
        , size: 255
        }
    , mailingaddress: 
        { type: "text"
        }
    , handle: 
        { type: "text"
        , size: 100
        }
    , phonenumber: 
        { type: "text"
        , size: 15
        }
    , joindate: 
        { type: "date"
        }
    , dob: 
        { type: "date"
        }
    , memberlevel: 
        { type: "enum"
        , values: ["subsidized", "maker", "sponser", "booster"]
        , defaultValue: "maker"
        }
    , memberstatus: 
        { type: "enum"
        , values: ["Banned", "Canceled", "Moved", "Pending Payment", "Good Standing", "Provisional"]
        , defaultValue: "Pending Payment"
        }
    , wavier: 
        { type: "boolean"
        , defaultValue: true
        }
    , role: 
        { type: "enum"
        , values: ["non-member", "member", "board", "founder"]
        , defaultValue: "member"
        }
    , adminlvl: 
        { type: "number"
        , defaultValue: 0
        }
    , paperfilloutdate: 
        { type: "date"
        }
    , isactive: 
        { type: "number"
        , defaultValue: 1
        }
    },
    { id: "memberid"
    , methods: 
        { getFullName: function()
            {
                return this.firstname + ' ' + this.lastname;
            }
        }
    }
);

var getAllMembers = function(req, res) {

};

var getMemberById = function(req, res) {
    var responseOptions = {};
    responseOptions.callback = req.query.callback || '';
    responseOptions.format = req.query.format || null;
    var id = req.route.params.id;
    Member.get(id, function(err, member){
        if (err) throw err;
        var members = {};
        members.member = member;
        redisClient.set("members." + id, JSON.stringify(member));
        redisClient.expire("members." + id, config.redis.expire);
        var apiServiceResponse = response.createResponse(members);
        response.respondToClient(res, responseOptions, apiServiceResponse);
    });  
};

module.exports = 
    { Member: Member
    , getById: getMemberById
    , getAll: getAllMembers
    };

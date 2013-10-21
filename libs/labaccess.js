var pg = require('pg'),
    async = require('async'),
    config = require('./config.js');

var pgConn = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" + config.postgres.host + "/" + config.postgres.database;
var pgClient = new pg.Client(pgConn);


// Connect to Postgres Database
pgClient.connect(function(err) {
    if(err) {
        console.log('Could not connect to postgres', err); 
    } else {
        console.log('Connect to Hacker Tracker');
    }
});

exports.findAll = function(req, res) {
    var pgQueryFindAll = "SELECT * FROM labaccess ORDER BY logintime ASC";
    pgClient.query(pgQueryFindAll, function(err, result) {
        if(err) {
            res.send({error: 1, errMsg: 'Error Querying Hacker Tracker ' + err})
            return console.error('Error Querying Hacker Tracker', err);
        }

        var results = result.rows;
        var callback = req.query.callback
        var format = req.query.format;
        if(typeof format != "undefined" || format != null) {
            res.send(JSON.stringify(results));
        } else {
            res.send(callback + '(' + JSON.stringify(results) + ')');
        }
    });
}

exports.getByMemberId = function(req, res) {
    var id = req.route.params.id;
    var pgQueryFindById = "SELECT * from labaccess WHERE memberid = '" + id + "' ORDER BY logintime DESC";
    pgClient.query(pgQueryFindById, function(err, result){
        if(err) {
            res.send({error: 1, errMsg: 'Error Querying Hacker Tracker ' + err})
            return console.error('Error Querying Hacker Tracker', err);
        } else {
            var results = result.rows;
            var callback = req.query.callback;
            var format = req.query.format;
            if(typeof format != "undefined" || format != null) {
                res.send(JSON.stringify(results));
            } else {
                res.send(callback + '(' + JSON.stringify(results) + ')');
            }
        }
    });
}

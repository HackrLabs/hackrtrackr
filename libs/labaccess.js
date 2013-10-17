var pg = require('pg'),
    async = require('async'),
    config = require('./config.js');

var pgConn = "postgres://" + config.psqlUser + ":" + config.psqlPassword + "@" + config.psqlHost + "/" + config.psqlDatabase;
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
        res.send(results);
    });
}

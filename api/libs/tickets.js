'use strict'

//var async = require('async');
var bookshelf = require('./dbconn').DATABASE,
    config = require('./config');
if(typeof bookshelf != "undefined"){
var Ticket = bookshelf.Model.extend(
    { tableName: 'tickets'
    }
);
}

module.exports = {
    Ticket: Ticket
}

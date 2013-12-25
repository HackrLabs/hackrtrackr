'use strict';

//var async = require('async');
var bookshelf = require('./dbconn').DATABASE,
    config = require('./config');

var Caveat = bookshelf.Model.extend(
    { tableName: 'caveats'
    }
)

module.exports = {
    Caveat: Caveat
};

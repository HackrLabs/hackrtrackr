'use strict';
var bookshelf = require('./dbconn').DATABASE
if(typeof bookshelf != "undefined"){
var Caveat = bookshelf.Model.extend(
    { tableName: 'caveats'
    }
)
}

module.exports = {
    Caveat: Caveat
};

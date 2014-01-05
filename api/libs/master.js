'use strict';

var config = require('./config'),
    dbconn = require('./dbconn'),
    bookshelf = require('./dbconn').MASTER;

var Master = bookshelf.Model.extend({
  tableName: 'accounts'
})

var checkMerchantExistance = function(merch, callback) {
    new Master({merchant: merch})
        .fetch({columns: ['merchant', 'client', 'connection']})
        .then(function(master){
            console.log('No Error!!!')
            console.log(master.get('client'))
            var clientInfo =
            { client: master.get('client') || 'sqlite3'
            , connection: JSON.parse(master.get('connection'))
            }
            dbconn.DATABASE = dbconn.setClient(clientInfo)
            if(typeof callback == "function") {
                callback.call(this, dbconn.DATABASE)
            }
        })
        .otherwise(function(err){
            console.error(err)
            if(typeof callback == "function") {
                callback.call(this, {couldNotFind: true})
            }
        })
}

module.exports =
{ Master: Master
, checkMerchantExistance: checkMerchantExistance
}

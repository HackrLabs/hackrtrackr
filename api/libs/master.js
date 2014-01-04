'use strict';

var config = require('./config'),
    dbconn = require('./dbconn'),
    bookshelf = require('./dbconn').MASTER;

var Master = bookshelf.Model.Extend({
  tableName: 'master'
})

var checkMerchantExistance = function(merchant, callback) {
  new Master()
    .fetch({subdomain: subdomain})
    .otherwise(function(err){
      if(typeof callback === "function") {
        callback.call(this, {error: true, msg: err})
      }
    })
    .then(function(master){

    })
}

module.exports =
{ Master: Master
, checkMerchantExistance: checkMerchantExistance
}

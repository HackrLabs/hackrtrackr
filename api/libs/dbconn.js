'use strict';

var config = require('./config'),
    bookshelf = require('bookshelf');

var setClient = function(clientInfo){
  return bookshelf.initialize(
    { client: clientInfo.client
    , connection: clientInfo.connection
    }
  );
};

bookshelf.MASTER = bookshelf.initialize(
  { client: config.master.client
  , connection: config.master.connection
  }
)

module.exports = 
{ MASTER: bookshelf.MASTER
, DATABASE: bookshelf.DATABASE
, setClient: setClient
};

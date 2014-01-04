'use strict';

var config = require('./config'),
    bookshelf = require('bookshelf');

var setClient = function(clientInfo){
  bookshelf.DATABASE = bookshelf.initialize(
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

module.exports = bookshelf;

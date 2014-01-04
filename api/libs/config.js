  'use strict';

var config =
{ app:
    { domain: 'hakrtracker.dev'
    , port:  7089
    , namespace: '/api'
    , stockResponse: 'json'
    }
, master:
  { client: 'sqlite3'
  , connection:
    { filename: __dirname + "database/master.db"
    }
  }
, sqlite3:
    { dbpath: __dirname + "/database/gadgetcat.db"
    }
, redis:
    { expire: 120
    }
};

module.exports = config;


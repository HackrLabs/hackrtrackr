'use strict';

var config = 
{ app:
    { domain: 'hakrtracker.dev'
    , port: 1234
    , namespace: '/api'
    , stockResponse: 'json'
    }
, postgres:
    { user: 'hackertracker'
    , password: 'hackallthethings'
    , host: 'localhost'
    , database: 'hackertracker'
    }
, redis:
    { expire: 120
    }
};

module.exports = config;


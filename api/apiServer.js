var express = require('express');
    require('express-namespace');
var config = require('./libs/config'),
    master = require('./libs/master')
    areas = require('./libs/areas'),
    doorAccess = require('./libs/doorAccess'),
    members = require('./libs/members'),
    cards = require('./libs/cards'),
    http = require('http'),
    sockjs = require('sockjs')


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

var checkMerchant = function(merchant) {
    console.log('Checking Merchant')
    console.log('Merchant is: ' + merchant)
    master.checkMerchantExistance(merchant, function(response){
        return response
    })
}
/*
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};

var sockjs = sockjs.createServer(sockjs_opts);
var sockets = {};
sockjs.on('connection', function(conn) {
    sockets[conn.id] = conn;
    console.log('Current Sockets: ' + sockets.length)
    
    conn.on('data', function(message) {
        console.log(message)
        router(JSON.parse(message), conn);
    });

    conn.on('close', function(){
        console.log('Connection closed');
        delete sockets[conn.id]
        console.log('Sockets Remaining: ' + sockets.length)
    })
});

var send = function(data, conn) {
    console.log('Attempting to send')
    conn.write(JSON.stringify(data));
}

var router = function(data, conn) {
    console.log(data)
    var route = data.prefix;
    console.log('route: ' + route)

    switch(route) {
        case 'getMerchantInfo':
            var merchantFound = checkMerchant(data.data)
            send(merchantFound, conn)
            break;
        case 'getAllMembers':
            var merchant = data.data.merchant
            var allMembers = members.getAll(merchant)
            send(JSON.stringify(allMembers), conn)
    }
}
*/
var app = express();
//var server = http.createServer(app);
//sockjs.installHandlers(server, {prefix:'/api'});
app.use(allowCrossDomain);
//app.all('*', checkMerchant);
app.namespace(config.app.namespace, function(){
    app.get('/', function(req, res) {
        res.send('This page is not active');
    });
    app.get('/dooraccess', doorAccess.getAll);
    app.get('/dooraccess/:id', doorAccess.getByMemberId);
    app.get('/areas', areas.findAll);
    app.get('/areas/:id', areas.getById);
    app.get('/members', members.getAll);
    app.get('/members/:id', members.getById);
    app.post('/members/add/', members.addMember);
    app.post('/members/update/', members.updateMember);
    app.post('/members/toggleEnabled/:memberid', members.toggleEnabled);
    app.post('/members/cards/add', cards.addCard);
    app.del('/members/cards/remove/:id', cards.removeCard);

});
app.listen(config.app.port)
//server.listen(config.app.port);
console.log('Listening on port ' + config.app.port);

var express = require('express'),
    labaccess = require('./libs/labaccess');

var app = express();
app.set('domain', 'api.hackertracker.dev');

app.get('/', function(req, res) {
    res.send('This page is not active');
});

app.get('/labaccess', labaccess.findAll);
//app.get('/lbaacces/:id', labaccess.getByMemberId);

app.listen(1234);
console.log('Listening on port 1234');

var express = require('express'),
    labaccess = require('./libs/labaccess'),
    areas = require('./libs/areas');

var app = express();
app.set('domain', 'api.hackertracker.dev');

app.get('/', function(req, res) {
    res.send('This page is not active');
});

app.get('/labaccess', labaccess.findAll);
app.get('/labaccess/:id', labaccess.getByMemberId);
app.get('/areas', areas.findAll);
app.get('/areas/:id', areas.getById);

app.listen(1234);
console.log('Listening on port 1235');

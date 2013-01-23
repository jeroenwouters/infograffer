var express = require('express'),
    item = require('./routes/items');
    map = require('./routes/map');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.options("*", function(req,res,next){res.send(200);});
 
app.get('/items', item.findAll);
app.get('/items/:id', item.findById);
app.post('/items', item.additem);
app.put('/items/:id', item.updateitem);
app.delete('/items/:id', item.deleteitem);

app.get('/maps', map.findAll);
app.get('/maps/:id', map.findById);
app.post('/maps', map.addmap);
app.put('/maps/:id', map.updatemap);
app.delete('/maps/:id', map.deletemap);
 
app.listen(3000);
console.log('Listening on port 3000...');
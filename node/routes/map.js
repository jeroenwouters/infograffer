var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('mapdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'mapdb' database");
        db.collection('maps', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'maps' collection doesn't exist. d");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving map: ' + id);
    db.collection('maps', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, map) {
            res.send(map);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('maps', function(err, collection) {
        collection.find().toArray(function(err, maps) {
            res.send(maps);
        });
    });
};
 
exports.addmap = function(req, res) {
    var map = req.body;
    console.log('Adding map: ' + JSON.stringify(map));
    db.collection('maps', function(err, collection) {
        collection.insert(map, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updatemap = function(req, res) {
    var id = req.params.id;
    var map = req.body;
    console.log('Updating map: ' + id);
    console.log(JSON.stringify(map));
    db.collection('maps', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, map, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating map: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(map);
            }
        });
    });
}
 
exports.deletemap = function(req, res) {
    var id = req.params.id;
    console.log('Deleting map: ' + id);
    db.collection('maps', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
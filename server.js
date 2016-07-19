var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(itemId) {
    if(itemId) {
        var i = this.items.map(function(x) { return x.id }).indexOf(itemId);
        this.items.splice(i, 1);
        return {status: 200, data: this.items};
    }
    return {status: 204, data: this.items};
};

Storage.prototype.update = function(itemId, content) {

    var exists;

    for (var i=0; i<this.items.length; i++){

        console.log(this.items[i]);
        if (this.items[i].id == itemId){
            exists = true;
            this.items[i].name = content;
            return {status: 200, data: this.items};
        }
        else {
            exists = false;
        }
    }

    if (exists == false){
        console.log('Falsey falsey!!');
        var item = {name: content, id: itemId};
        this.items.push(item);
        this.id += 1;
        console.log(this.items.indexOf(item));
        return {status: 200, data: this.items};
    }

};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:itemId', jsonParser, function(req, res) {
    var item = storage.delete(req.params.itemId);
    res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res){

    console.log('Id = ', req.params.id);
    console.log(req.body.name);
    var item = storage.update(req.params.id, req.body.name);
    res.status(item.status).json(item.data);


});

app.listen(process.env.PORT || 8080);
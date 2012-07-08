
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose');

var app = module.exports = express.createServer();

mongoose.connect('mongodb://localhost/blueberry');

var fullMonth = ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

var mapToArchive = function(obj){
  var archive = {
    year : obj._id.year,
    monthName: fullMonth[obj._id.month],
    month : obj._id.month,
    count: obj.value.count
  }

  return archive;
};

var getArchives = function(req, res, next) {
  mongoose.connection.db.collection('postsPerMonth', function(error, collection) {
    collection.find().toArray(function(error, postsPerMonth){
      var archives = postsPerMonth.map(mapToArchive);
      
      req.archives = archives;
      next();
    });
  });
};

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false, pretty: true });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use('/Styles', express.static(__dirname + '/Styles'));
  app.use('/Images', express.static(__dirname + '/Images'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', getArchives, routes.index);
app.get('/post/:id', getArchives, routes.post);
app.get('/archives', getArchives, routes.postsByMonthYear);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

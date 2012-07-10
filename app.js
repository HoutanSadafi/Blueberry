
/**
 * Module dependencies.
 */
var express = require('express'),
    mongoose = require('./mongo').mongoose,
    util = require('./utilities'),
    app = express.createServer(),
    routes = require('./routes/')(app);



var mapToArchive = function(obj){
  var archive = {
    year : obj._id.year,
    monthName: util.months.long[obj._id.month],
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
  app.use('/Styles', express.static(__dirname + '/Styles'));
  app.use('/Images', express.static(__dirname + '/Images'));
  app.use(app.router);
  app.use(function(req, res, next){
    res.status(404);
    res.render("404", {});
  });
  app.use(function(err, req, res, next){
    res.status(500);
    res.render("500", {});
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', getArchives, routes.post.list);
app.get('/post/:id', getArchives, routes.post.view);
app.get('/archive', getArchives, routes.archive.list);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

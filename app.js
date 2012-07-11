
/**
 * Module dependencies.
 */
var express = require('express'),
    mongoose = require('./mongo').mongoose,
    util = require('./utilities'),
    app = express.createServer(),
    routes = require('./routes/')(app);


var aggregate = (function(m, u){

  var mapToArchive = function(obj){
    var archive = {
      year : obj._id.year,
      monthName: u.months.long[obj._id.month],
      month : obj._id.month,
      count: obj.value.count
    }

    return archive;
  };

  var mapToAuthor = function(obj){
    var author = {
      fullname : obj._id.author,
      count: obj.value.count
    }

    return author;
  };

  var getPostsPerMonth = function(req, res, next) {
    m.connection.db.collection('postsPerMonth', function(error, collection) {

      collection.find().toArray(function(error, postsPerMonth){
        var archives = postsPerMonth.map(mapToArchive);
        
        req.postsPerMonth = archives;
        next();
      });
    });
  };

  var getPostsPerAuthor = function(req, res, next) {
    m.connection.db.collection('postsPerAuthor', function(error, collection) {

      collection.find().toArray(function(error, postsPerAuthor){
        var authors = postsPerAuthor.map(mapToAuthor);
        
        req.postsPerAuthor = authors;
        next();
      });
    });
  };

  return {
    getPostsPerMonth : getPostsPerMonth,
    getPostsPerAuthor : getPostsPerAuthor
  };

})(mongoose, util);

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
  app.use(function(err, req, res, next){
    res.status(500);
    res.render("500", {title : ''});
  });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', aggregate.getPostsPerMonth, aggregate.getPostsPerAuthor, routes.post.list);
app.get('/post', aggregate.getPostsPerMonth, aggregate.getPostsPerAuthor, routes.post.list);
app.get('/post/:id', aggregate.getPostsPerMonth, aggregate.getPostsPerAuthor, routes.post.view);
app.get('/archive', aggregate.getPostsPerMonth, aggregate.getPostsPerAuthor, routes.archive.list);
app.get('/author', aggregate.getPostsPerMonth, aggregate.getPostsPerAuthor, routes.post.list);
app.get('/author/:query', aggregate.getPostsPerMonth, aggregate.getPostsPerAuthor, routes.author.list);
app.get('/about', aggregate.getPostsPerMonth, aggregate.getPostsPerAuthor, function(req, res, next){
  res.render("about", { title : '', url: req.url, postsPerMonth: req.postsPerMonth, postsPerAuthor: req.postsPerAuthor});
});
app.all('/*', aggregate.getPostsPerMonth, aggregate.getPostsPerAuthor, function(req, res, next){
  res.status(404);
  res.render("404", { title : '', url: req.url, postsPerMonth: req.postsPerMonth, postsPerAuthor: req.postsPerAuthor});
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

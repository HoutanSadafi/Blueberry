
var mongo = require('../mongo'),
    util = require('../utilities'),
    Posts = mongo.models.Posts,
    mongoose = mongo.mongoose,
    post = {};



post.list = function(req, res){
  var pageSize = util.tryParseInt(req.query["size"], 2);
  var pageNumber = util.tryParseInt(req.query["page"], 1);

  var numberToSkip = pageSize*(pageNumber-1);
  var query = Posts.find({}).sort('date', -1).skip(numberToSkip).limit(pageSize);

  query.exec(function(error, posts) {

    if (posts.length == 0){
      res.redirect('/');
    } else {
      posts.forEach(function(post){
        post.year = post.date.getFullYear();
        post.day = post.date.getDay().lpad(2);
        post.month = post.date.getMonthAbr();
      });

      Posts.count({}, function(error, count){

        var nextPage = false;
        var previousPage = false;

        if ((count - (numberToSkip+pageSize)) > 0){
          nextPage = true;
        }

        if (numberToSkip > 0){
          previousPage = true;
        }

        res.render('index', { posts : posts, 
                                  pagination : { 
                                            previousPageNumber: pageNumber-1, 
                                            nextPageNumber: pageNumber+1, 
                                            nextPage: nextPage, 
                                            previousPage: previousPage 
                                          },
                                  archives: req.archives});
      });
    } 
  });
};

post.view = function(req, res){
  Posts.findOne({id : req.params.id}, function(error, post){

    if (!post){
      res.redirect('/');
    } else {
      post.year = post.date.getFullYear();
      post.day = post.date.getDay().lpad(2);
      post.month = post.date.getMonthAbr();

      res.render('post', {post: post, archives: req.archives});
    }
  });
};

exports.post = post;
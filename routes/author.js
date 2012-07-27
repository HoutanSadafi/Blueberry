
var mongo = require('../mongo'),
    util = require('../utilities'),
    config = require('../config'),
    Posts = mongo.models.Posts,
    mongoose = mongo.mongoose;
    author = {};

author.list = function(req, res){
  var searchQuery = req.params.query

  Posts.find({"author.fullname" : searchQuery }).sort('date', -1).exec(function(error, posts){

    if (!posts || posts.length == 0){
      res.redirect('/');
    } else {
      posts.forEach(function(post){
        post.year = post.date.getFullYear();
        post.day = post.date.getDate().lpad(2);
        post.month = post.date.getMonthAbr();
      });
      res.render('index', { title : util.createPageTitle(config.page.defaultTitle, searchQuery),
                            posts : posts, 
                            pagination : { 
                                      nextPage: false, 
                                      previousPage: false 
                                    },
                            postsPerMonth: req.postsPerMonth,
                            postsPerAuthor: req.postsPerAuthor});
    }
  });
};

exports.author = author;
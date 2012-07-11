
var mongo = require('../mongo'),
    util = require('../utilities'),
    Posts = mongo.models.Posts,
    mongoose = mongo.mongoose;
    author = {};

author.list = function(req, res){
  var searchQuery = req.params.query
  console.log(searchQuery);  
  Posts.find({"author.fullname" : searchQuery }).sort('date', -1).exec(function(error, posts){

    if (!posts || posts.length == 0){
      res.redirect('/');
    } else {
      posts.forEach(function(post){
        post.year = post.date.getFullYear();
        post.day = post.date.getDay().lpad(2);
        post.month = post.date.getMonthAbr();
      });
      res.render('index', { posts : posts, 
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
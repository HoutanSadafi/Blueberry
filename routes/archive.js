
var mongo = require('../mongo'),
    util = require('../utilities'),
    config = require('../config'),
    Posts = mongo.models.Posts,
    mongoose = mongo.mongoose;
    archive = {};

archive.list = function(req, res){
  var year = req.query["year"];
  var month = req.query["month"];

  if (!year || !month){
    res.redirect('/');
  } else {
      Posts.find().$where('this.date.getFullYear() === ' + year + ' && this.date.getMonth() === '+ month + '').sort('date', -1).exec(function(error, posts){
    
        if (!posts || posts.length == 0){
          res.redirect('/');
        } else {
          posts.forEach(function(post){
            post.year = post.date.getUTCFullYear();
            post.day = post.date.getUTCDate().lpad(2);
            post.month = post.date.getMonthAbr();
          });
          res.render('index', { title : util.createPageTitle(config.page.defaultTitle, util.months.long[month], year),
                                posts : posts, 
                                pagination : { 
                                          nextPage: false, 
                                          previousPage: false 
                                        },
                                postsPerMonth: req.postsPerMonth,
                                postsPerAuthor: req.postsPerAuthor});
        }
      });
  }
};

exports.archive = archive;
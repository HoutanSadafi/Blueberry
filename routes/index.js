var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/blueberry');

var PostSchema = new Schema({
  objectid : ObjectId,
  id : Number,
  date : Date,
  title : String,
  content : String,
  author : {
    fullname : String,
    url : String,
    avatar: String
  }
});

var mmm = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];

var Posts = mongoose.model('posts', PostSchema);

Date.prototype.getMonthAbr = function(){
    if (!Date.prototype.getMonthAbr.months) {
        Date.prototype.getMonthAbr.months = mmm;
    }

    var monthNum = this.getMonth();
    return Date.prototype.getMonthAbr.months[monthNum];
};

Number.prototype.lpad = function(padding){
    var zeroes = "0";
    for (var i = 0; i < padding; i++) { zeroes += "0"; }
    return (zeroes + this.toString()).slice(padding * -1);
};

var tryParseInt = function(value, defaultValue){
  if (!value) return defaultValue;
  return isNaN(value) ? defaultValue : parseInt(value);
};


exports.index = function(req, res){
  var pageSize = tryParseInt(req.query["size"], 2);
  var pageNumber = tryParseInt(req.query["page"], 1);

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

exports.post = function(req, res){
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

exports.postsByMonthYear = function(req, res){
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
            post.year = post.date.getFullYear();
            post.day = post.date.getDay().lpad(2);
            post.month = post.date.getMonthAbr();
          });
          res.render('index', { posts : posts, 
                                    pagination : { 
                                              nextPage: false, 
                                              previousPage: false 
                                            },
                                    archives: req.archives});
        }
      });
  }
};
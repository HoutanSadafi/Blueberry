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

var Posts = mongoose.model('post', PostSchema);

Date.prototype.getMonthAbr = function(){
    if (!Date.prototype.getMonthAbr.months) {
        Date.prototype.getMonthAbr.months = [];
        Date.prototype.getMonthAbr.months.push('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec');
    }

    var monthNum = this.getMonth();
    return Date.prototype.getMonthAbr.months[monthNum];
};

Number.prototype.lpad = function(padding){
    var zeroes = "0";
    for (var i = 0; i < padding; i++) { zeroes += "0"; }
    return (zeroes + this.toString()).slice(padding * -1);
};

exports.index = function(req, res){
  
  Posts.find(function(error, posts) {
    posts.forEach(function(post){
      post.year = post.date.getFullYear();
      post.day = post.date.getDay().lpad(2);
      post.month = post.date.getMonthAbr();
    });

    res.render('index', { posts : posts });
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

      res.render('post', {post: post});
    }
  });
};

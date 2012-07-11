
(function(ex){

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

var models = { Posts : mongoose.model('posts', PostSchema) };

ex.mongoose = mongoose;
ex.models = models;

})(exports);

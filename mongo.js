
(function(ex){

var config = require('./config'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var createMongoConnectionString = function(url, username, password) {
  var protocol = 'mongodb://';

  if ((username && username.length > 0 ) && (password && password.length > 0 )){
    return protocol + username + ':' + password + '@' + url;
  } else {
    return protocol + url;
  }
}

var cs = createMongoConnectionString(config.mongo.url, 
                                             config.mongo.username, 
                                             config.mongo.password)

console.log('connecting to: ' + config.mongo.url);

mongoose.connect(cs);


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

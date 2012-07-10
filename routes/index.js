var fs = require('fs');

module.exports = function(app){
    var routes = {};
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == "index.js") return;
        var name = file.substr(0, file.indexOf('.'));
        routes[name] = require('./' + name)[name];
    });

    return routes;
}
var path = require("path");
var Builder = require('systemjs-builder');

// optional constructor options
// sets the baseURL and loads the configuration file
var builder = new Builder('/', './systemjs.config.js');

builder
.buildStatic('./app/main.js', './outfile.js', {
  globalName: 'NoIdentity'
})
.then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});

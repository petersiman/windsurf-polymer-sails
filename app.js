var Sails = require('sails').constructor;

// Configure and lift app
var app = new Sails();
app.lift({
  hooks: { grunt: false }
});

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  moment = require('moment');
  var LocalStrategy = require('passport-local').Strategy;
  sails.services.passport.loadStrategies();
    
    User.findOne({username : 'test'}, function(err, user){
        if (!user) {
            console.log('Default user doesnt exist.');
            var defaultUser = {
                username : 'test',
                email : 'test@test.com',
                passports : [{protocol : 'local', password : 'test1234'}],
                role : 'admin'
            };
            User.create(defaultUser, function(err, newUser){
                if (!err){
                    console.log('Default user ' + newUser.username + ' was successfully created.');
                }
            });
        } 
    });
    
    
    

  cb();
};

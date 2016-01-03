/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function(req,res){
        res.view();
    },
    create: function(req, res, next){
        var userToBe = req.params.all();
        req.file('profileImage').upload({

              // You can apply a file upload limit (in bytes)
              maxBytes: 100000
              
            }, function whenDone(err, uploadedFiles) {
              if (err) {
                console.log('Upload error: ');
                console.log(err);
                
                req.session.flash = {
                    err: err
                }
                return res.redirect('/advert/new');
              } 
              else {
                console.log(uploadedFiles);
                var fs = require('fs');
                var path = require('path');
                if (uploadedFiles && uploadedFiles.length == 1){
                    console.log('Adding image file ' + uploadedFiles[0]);
                    var basename = path.basename(uploadedFiles[0].fd);
                    fs.createReadStream(uploadedFiles[0].fd).pipe(fs.createWriteStream('./upload/profile_pictures/' + basename));
                    userToBe.profileImage = {
                        fileName: uploadedFiles[0].filename,
                        path: './upload/profile_pictures/' + basename,
                        type: uploadedFiles[0].type
                    };
                }
                User.create(userToBe, function userCreated(err, user){
                    if (err) {
                        console.log('Error creating user: ' + JSON.stringify(err));
                        req.session.flash = {
                            err: err
                        }
                        return res.redirect('/user/new');
                    }
                        
                    console.log('User created successfully: ' + JSON.stringify(user));    
                    return res.redirect('/user/show/' + user.id);
                });
              }
            });
        
    },
    show: function(req, res){
        User.findOne(req.param('id'))
        .populate('profileImage')
        .exec(function(err, user){
            if (err){
                return next(err);
            }
            
            var adverts = [];
            var users = [];
            
            if (user.isAdmin()){
                adverts = Advert.find({where: {state : 'new'}, limit : 20});
                users = User.find({limit: 20});
            } else {
                adverts = Advert.find({where: {state : 'new' , creator : user.id}, limit : 20});
            }
            
            res.view({
                user: user,
                adverts: adverts,
                users: users
            });
        });
    }
};


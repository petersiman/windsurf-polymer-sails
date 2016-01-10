/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    show: function(req,res){
        ProfileImage.findOne(req.param('id'), function foundImage(err, image){
            console.log('Serving profile image: ' + JSON.stringify(image));
            res.sendfile(image.path);
        });
    }
	
};


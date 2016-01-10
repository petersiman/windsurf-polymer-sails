/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    show: function(req,res){
        Image.findOne(req.param('id'), function foundImage(err, image){
            console.log('Serving image: ' + JSON.stringify(image));
            res.sendfile(image.path);
        });
    }
	
};


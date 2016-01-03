/**
 * AdvertController
 *
 * @description :: Server-side logic for managing adverts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    new: function(req,res){
        res.view();
    },
    show: function (req, res) {
		console.log("Looking for adverts ...");
        var filter = {};
        if (req.param('advertType')){
            console.log('Filtering...');
            console.log('advert type: ' + req.param('advertType'));
            filter.advertType = req.param('advertType');
        }

        if ( req.param('advertCategory')){
            console.log('advert category: ' + req.param('advertCategory'));
            filter.advertCategory = req.param('advertCategory');
        }
        if (req.param('q')){
            console.log('seaching for query: ' + req.param('q'));
            filter.or = [{'advertTitle' : {'contains' : req.param('q')}}, {'advertBody' : {'contains' : req.param('q')}}]
        }
        filter.state = 'new';
        console.log("Got filter: " + JSON.stringify(filter));
        Advert.find(filter)
        .populate('images')
        .sort('createdAt desc')
        .limit(10)
        .exec(function(err, adverts) {
          console.log(JSON.stringify(adverts));
          res.view({
            adverts: adverts,
            filter: filter
          });
        });
    },
    list: function (req, res) {
		console.log("Looking for adverts ...");
        var filter = {};
        if (req.param('advertType')){
            console.log('Filtering...');
            console.log('advert type: ' + req.param('advertType'));
            filter.advertType = req.param('advertType');
        }

        if ( req.param('advertCategory')){
            console.log('advert category: ' + req.param('advertCategory'));
            filter.advertCategory = req.param('advertCategory');
        }
        if (req.param('q')){
            console.log('seaching for query: ' + req.param('q'));
            filter.or = [{'advertTitle' : {'contains' : req.param('q')}}, {'advertBody' : {'contains' : req.param('q')}}]
        }
        filter.state = 'new';
        console.log("Got filter: " + JSON.stringify(filter));
        Advert.find(filter)
        .populate('images')
        .sort('createdAt desc')
        .limit(10)
        .exec(function(err, adverts) {
          console.log(JSON.stringify(adverts));
          res.send(adverts);
        });
    },
    sold: function(req, res, next){
      Advert.findOne(req.param('id')).exec(function(err, advert){
        var result = {};
        if (err){
          result.success = false;
          res.send(result);
        }

        if (req.user.id == advert.creator){
            Advert.update({id: advert.id}, {state: 'sold'}).exec(function(err, adverts){
                if (err){
                    console.error('Error while updating advers');
                    result.success = false;
                    res.send(result);
                }

                console.log(adverts.length + ' adverts updated.');
                result.success = true;
                res.send(result);
            });

        }

      });

    },
    create: function (req, res, next) {
        var advertToBe = req.params.all();
        advertToBe.creator = req.user;
        console.log('Request params: ' + JSON.stringify(req.params.all()));
        req.file('imageFile').upload({

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
                advertToBe.images = [uploadedFiles.length]
                var fs = require('fs');
                var path = require('path');
                for (i = 0; i < uploadedFiles.length; i++){
                    console.log('Adding image file ' + uploadedFiles[i]);
                    var basename = path.basename(uploadedFiles[i].fd);
                    fs.createReadStream(uploadedFiles[i].fd).pipe(fs.createWriteStream('./upload/images/' + basename));
                    advertToBe.images[i] = {
                        fileName: uploadedFiles[i].filename,
                        path: './upload/images/' + basename,
                        type: uploadedFiles[i].type
                    };
                }
                Advert.create(advertToBe,function advertCreated(err, advert){
                    console.log('Creating new advert ...');
                    if (err) {
                        console.log('Validation error: ');
                        console.log(err);

                        req.session.flash = {
                            err: err
                        }

                        return res.redirect('/advert/new');
                    }
                    console.log(JSON.stringify(advert));
                    res.redirect('/advert/show');
                });
              // return res.json({
                // files: uploadedFiles,
                // textParams: req.params.all()
              // });
              }
            });

    },
    edit: function (req, res) {
		return res.send("Hi there!");
    },
    delete: function (req, res) {
      var advert = Advert.findOne(req.param('id'));
      console.log('Got advert :' + JSON.stringify(advert.title));
      var result = {success:false};
      if (req.user == advert.creator){
          Advert.destroy(advert)
          console.log('Advert was deleted');
          result.success = true;
      }
      res.send(result);
    }

};

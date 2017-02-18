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
    getById: function(req, res){
      var advertId = req.param('advertId');
      sails.log.debug('Getting advert by ID: ' + advertId);
      Advert.findOne({"id" : advertId})
      .exec(function(err, advert){
        if (err){
          sails.log.error(err, "Error while retrieving advert with ID: " + advertId)
        }
        sails.log.debug('Got advert: ' + JSON.stringify(advert));
        res.send(advert);
      });
    },
    list: function (req, res) {
		    sails.log.debug("Looking for adverts ...");
        if (cloudinary){
          sails.log.debug('Cloudinary ready');
        }

        var filter = {};
        var filtersFromReq = req.param('filters')
        sails.log.debug("Filters in request: %s", filtersFromReq);
        if (filtersFromReq){
          filtersFromReq = JSON.parse(filtersFromReq);
          sails.log.debug('Filtering  ...');
          if (filtersFromReq.advertType){
            sails.log.debug('Advert type: %s', filtersFromReq.advertType);
            filter.advertType = filtersFromReq.advertType;
          }
          if (filtersFromReq.advertCategory) {
            sails.log.debug('Advert category: %s', filtersFromReq.advertCategory);
            filter.advertCategory = filtersFromReq.advertCategory;
          }

          if (filtersFromReq.price && filtersFromReq.price.length > 0){
            sails.log.debug("Advert price: %s", filtersFromReq.price);
            filter.price = {
              "and" : []
            };
            filtersFromReq.price.forEach(function(item){
              var prices = item.split("-");
              sails.log.debug("Price range is %j", prices);
              filter.price.and.push({"gte" : prices[0]});
              sails.log.trace("Pushed lower price boundary %d", prices[0]);
              if (prices.length > 1) {
                  filter.price.and.push({"lte" : prices[1]});
                  sails.log.trace("Pushed upper price boundary %d", prices[1]);
              }
            });
            sails.log.trace("Advert price filter: %j", filter.price);
          }

        }
        if (req.param('q')){
            sails.log.debug('Query: %s', req.param('q'));
            filter.or = [{'advertTitle' : {'contains' : req.param('q')}}, {'advertBody' : {'contains' : req.param('q')}}]
        }
        filter.state = 'new';

        sails.log.debug("Got final filter: %j", filter);
        Advert.find(filter)
        .sort('createdAt desc')
        .limit(10)
        .exec(function(err, adverts) {
          if (err){
            sails.log.error(err, 'Error while getting adverts with filter '
                + filter);
          }
          sails.log(JSON.stringify(adverts));
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
                    sails.log.error('Error while updating advers');
                    result.success = false;
                    res.send(result);
                }

                sails.log(adverts.length + ' adverts updated.');
                result.success = true;
                res.send(result);
            });

        }

      });

    },
    create: function (req, res, next) {
        var result = {
          'success' : false
        };
        var advertToBe = {
          'images' : [],
          'advertBody' : req.param('advertBody'),
          'title' : req.param('title'),
          'advertType' : req.param('advertType'),
          'advertCategory' : req.param('advertCategory'),
          'price' : req.param('price'),
          'creator' : req.user
        }
        sails.log('Request params: ' + JSON.stringify(req.params.all()));
        if (req.param('images')){
            var images = req.param('images').split(',');
            images.forEach(function(item){
              advertToBe.images.push(item);
            });
        } else {
          sails.log.error('No images where uploded. Provide at least 1 image');
          result.err = 'Provide at lease one image.';
          res.send(result);
        }
        Advert.create(advertToBe,function advertCreated(err, advert){
            sails.log('Creating new advert ...');
            if (err) {
                sails.log('Validation error: ');
                sails.log(err);

                req.session.flash = {
                    err: err
                }
                result.err = err;
            } else {
              result.success = true;
            }
            sails.log(JSON.stringify(advert));
            res.send(result);
        });
    },
    edit: function (req, res) {
		return res.send("Hi there!");
    },
    delete: function (req, res) {
      var advert = Advert.findOne(req.param('id'));
      sails.log('Got advert :' + JSON.stringify(advert.title));
      var result = {success:false};
      if (req.user == advert.creator){
          Advert.destroy(advert)
          sails.log('Advert was deleted');
          result.success = true;
      }
      res.send(result);
    },
    upload: function(req, res){
      req.file('image').upload({
        // don't allow the total upload size to exceed ~10MB
        maxBytes: 10000000
      },function whenDone(err, uploadedFiles) {
        if (err) {
          return res.negotiate(err);
        }

        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0){
          return res.badRequest('No file was uploaded');
        }

        sails.log.debug('Uploaded ' + uploadedFiles.length + ' files.');
        // Save the "fd" and the url where the avatar for a user can be accessed
        sails.log.verbose(uploadedFiles[0].fd);
        cloudinary.uploader.upload(uploadedFiles[0].fd, function(result) {
          sails.log.debug(result)
          res.send(result);
        });
      });
    }

};

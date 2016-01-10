/**
* Image.js
*
* @description :: Image model - represents the uploaded image.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      id: {
          type: 'integer',
          primaryKey: true,
          autoIncrement: true
      },
      fileName: {
          type: 'string',
          defaultsTo: 'unknown.jpg'
      },
      path: {
          type: 'string',
          required: true
      },
      type: {
          type: 'string',
          defaultsTo: 'image/jpg'
      },
      advert: {
          model: 'advert'
      }

  }
};


/**
* Advert.js
*
* @description :: Advert model, represents the advertisment added by user.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

    attributes: {
    id : {
        type: 'integer',
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: 'string',
        required: true
    },
    advertType: {
        type: 'string',
        defaultsTo: 'buy',
        enum: ['buy', 'sell', 'give']
    },
    advertCategory: {
        type: 'string', 
        defaultsTo: 'complete',
        enum: ['complete', 'sail', 'board', 'clothes', 'other']
    },
    price: {
        type: 'integer',
        defaultsTo: -1
    },
    creator: {
        model: 'user'
    },
    images: {
        collection: 'image',
        via: 'advert'
    },
    advertBody: {
        type: 'text',
        required: true
    },
    state: {
        type: 'string',
        required: true,
        defaultsTo: 'new',
        enum: ['new', 'sold', 'deleted']
    }
    }
};


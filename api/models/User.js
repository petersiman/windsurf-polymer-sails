/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    schema: true,

    attributes: {
        id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: 'string',
            required: true,
            unique: true
        },
        email: {
          type: 'email',
          required: true,
          unique: true
        },
        yearOfBirth: {
          type: 'integer'
        },
        profileImage: {
            model: 'profileImage'
        },
        passports : { collection: 'Passport', via: 'user' },

        role: {
          type: 'string',
          required: 'true',
          defaultsTo: 'user',
          enum: ['user', 'admin']
        },

        toJSON: function(){
          var obj = this.toObject();
          delete obj._csrf;
          return obj;
        },

        isAdmin: function(){
          return this.role == 'admin';
        }

    }
};

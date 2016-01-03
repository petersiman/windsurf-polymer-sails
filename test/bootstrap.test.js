var Sails = require('sails'),
  Chai = require('chai');

before(function(done) {
  Chai.should();

  Sails.lift({
    connections: {
      localDiskDb: {
        adapter: 'sails-disk',
        filePath: '.tmp/test/'
      }
    },
    models: {
      connection: 'localDiskDb',
      migrate: 'drop'
    },
    port: 1234,
    hooks: {
      grunt: false
    },
    log: {
      level: 'error'
    }
  }, done);
});

after(function(done) {
  sails.lower(done);
});

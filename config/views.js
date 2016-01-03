var read = require('fs').readFile;

module.exports.views = {
  engine: {
    /*
     * View engine which simply reads HTML files (does not use any templating at all).
     */
    ext: 'html',
    fn: function (path, options, fn) {
      var key = path + ':string';

      if ('function' === typeof options) {
        fn = options;
      }

      if (options.cache && cache[key]) {
        return fn(null, cache[key]);
      }

      read(path, 'utf8', function (err, str) {
        if (options.cache) {
          cache[key] = str;
        }

        fn(null, str);
      });
    }
  },
  layout: false
};

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodemon: {
      dev: {
        script: 'app.js',
        watch: ['**/*']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'nyan', //spec or nyan are best
          log: false
        },
        src: ['test/**/*.test.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['nodemon']);
  grunt.registerTask('test', ['mochaTest']);

};

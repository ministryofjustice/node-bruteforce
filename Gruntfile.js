module.exports = function(grunt) {
  
  // Config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [ 'Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      scripts: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'mocha-chai-sinon'],
        options: {
          deboundeDelay: 10000
        }
      } 
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false, // Optionally suppress output to standard out (defaults to false) 
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
        },
        src: ['test/**/*.js']
      }
    }
  });

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-mocha-test");

  // Register Tasks
  grunt.registerTask('default', ['jshint', 'mochaTest']);
  grunt.registerTask('test', ['mochaTest']);
};
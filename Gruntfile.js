module.exports = function(grunt) {
  
  // Config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [ 'Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    env : {
      dev : {
        NODE_ENV : grunt.option('environment') || 'test',
      }
    },
    run: {
      mockServer: {
        options: {
          wait: false
        },
        // cmd: "node", // but that's the default 
        args: [
          'test/support/mockServer.js'
        ]
      }
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
          quiet: false,
          clearRequireCache: false,
          require: 'coverage/blanket'
        },
        src: ['test/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['test/*.js']
      }
    }
  });

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-run');

  // Register Tasks
  grunt.registerTask('default', ['env', 'run:mockServer', 'jshint', 'mochaTest']);
  grunt.registerTask('test', ['env', 'run:mockServer', 'mochaTest']);
};
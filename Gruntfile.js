module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    wiredep: {
      task: {
        src: ['client/index.html'],
        // aboslute paths instead of relative paths http://stackoverflow.com/a/26024882/679716
        ignorePath: /^(\/|\.+(?!\/[^\.]))+\.+/ 
      }
    },
    
    angularFileLoader: {
      options: {
        scripts: ['client/app/**/*.js'],
        relative: false
      },
      your_target: {
        src: ['client/index.html']
      }
    },
    /* 
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'src/client/styles/main.css': 'src/client/scss/main.scss'
        }
      }
    },
    */

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      angularFileLoader: {
        files: ['client/app/app.module.js'],
        tasks: ['angularFileLoader']
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      default: [
        'watch'
      ]
    }

  });

  // concurrent tasks most go last   
  grunt.registerTask('default', [
    'wiredep',
    'concurrent:default'
  ]);
};

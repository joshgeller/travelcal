module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    wiredep: {
      task: {
        src: ['client/index.html'],
        fileTypes: {
          fileExtension: {
            replace: {
              css: '<link rel=\"stylesheet\" href=\"{% static \'{{filePath}}\' %}\" />',
              js: '<script src=\'{% static \'{{filePath}}\' %}\'></script>'
            }
          }
        }
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

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'client/style/css/main.css': 'client/style/scss/main.scss'
        }
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      sass: {
        files: ['client/style/scss/**/*.scss'],
        tasks: ['sass']
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
    'sass',
    'concurrent:default'
  ]);
};

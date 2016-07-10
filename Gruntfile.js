module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    serverConfig: grunt.file.readJSON('config.json'),

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

    shell: {
      test: {
        options: {
          stdout: true
        },
        command: 'echo <%= serverConfig.server %>'
      },
      pythonServer: {
        options: {
          stdout: true
        },
        command: 'python server/manage.py runserver <%= serverConfig.server %>:<%= serverConfig.port %>'
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
        'shell:pythonServer',
        'watch'
      ]
    }
  });

  // concurrent tasks most go last
  // tasks before will run once the first timer, and can be repeated in watch for
  // watching directories
  grunt.registerTask('default', [
    'sass',
    'wiredep',
    'concurrent:default'
  ]);
};

module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({
    lint: {
       files: ['grunt.js'],
       src: ['js/**/*.js']
    },
    jshint: {
            options: {
                browser: true,
                curly: false,
                eqeqeq: false,
                newcap: false,
                undef: false,
                eqnull: true,
                node: false
            },
            globals: {
                exports: true,
                Ext: true,
                console: true,
                alert: true,
                prompt: true
            }
        },
    min: {
      dist: {
        src: ['js/**/*.js'],
        dest: 'dist/fiware.js'
      }
    },
    concat: {
      dist: {
        src: ['index.temp.head.html', 'index.temp.foot.html'],
        dest: 'dist/index.html'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['lint', 'min', 'concat']);

};
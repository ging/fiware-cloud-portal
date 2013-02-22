module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: ['js/**/*.js'],
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
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      libs: {
        src: ['js/os-utils.js'],
        dest: 'dist/libs.js'
      },
      models: {
        src: ['js/models/**/*.js'],
        dest: 'dist/models.js'
      },
      views: {
        src: ['js/views/**/*.js'],
        dest: 'dist/views.js'
      },
      routes: {
        src: ['js/routes/**/*.js'],
        dest: 'dist/routes.js'
      }
    },
    concat: {
      libs: {
        src: ['js/os-utils.js'],
        dest: 'dist/libs.js'
      },
      models: {
        src: ['js/models/**/*.js'],
        dest: 'dist/models.js'
      },
      views: {
        src: ['js/views/**/*.js'],
        dest: 'dist/views.js'
      },
      routes: {
        src: ['js/routes/**/*.js'],
        dest: 'dist/routes.js'
      },
      dist: {
        src: ['index.temp.head.html', 'index.temp.foot.html'],
        dest: 'dist/index.html'
      },
      disttest: {
        src: ['index.temp.head.test.html', 'index.temp.foot.html'],
        dest: 'dist/index.test.html'
      }
    },
    copy: {
      main: {
        files: [
          {src: ['lib/**/*'], dest: 'dist/'},
          {src: ['templates/**/*'], dest: 'dist/'},
          {src: ['locales/**/*'], dest: 'dist/'},
          {src: ['fonts/**/*'], dest: 'dist/'}
        ]
      }
    },
    clean: ['dist/']
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('default', ['jshint', 'uglify', 'concat:dist', 'concat:disttest', 'copy']);

};
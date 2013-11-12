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
          {src: ['fonts/**/*'], dest: 'dist/'},
          {src: ['css/**/*'], dest: 'dist/'},
          {src: ['ico/**/*'], dest: 'dist/'},
          {src: ['images/**/*'], dest: 'dist/'}
        ]
      }
    },
    sass: {
      dist: {
          options: {
            style: 'compressed'
          },
          files: {
              'css/style2.css': ['css/src/root.scss', 'css/src/navTab.scss', 'css/src/topBar.scss', 'css/src/sideBar.scss', 'css/src/tables.scss', 'css/src/icons.scss', 'css/src/forms/tiers.scss', 'css/src/blueprint.scss']
          }
      }
    },
    clean: ['dist/']
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'concat:disttest', 'copy', 'sass']);

};
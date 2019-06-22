"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
// const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const rtlcss = require('gulp-rtlcss');
const uglify = require("gulp-uglify");

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Statix Design - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2019-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/statixdesign/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');

// Clean vendor
function clean() {
  return del(["./assets/lib/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {

  // JQuery
  var lib_jquery = gulp.src([
    '../../node_modules/jquery/LICENSE*',
    '../../node_modules/jquery/dist/*.min.*'
  ]).pipe(gulp.dest('./assets/lib/jquery'))

  // Bootstrap
  var lib_bootstrap = gulp.src([
    '../../node_modules/bootstrap/LICENSE*',
    '../../node_modules/bootstrap/dist/js/*.min.*'
  ]).pipe(gulp.dest('./assets/lib/bootstrap'))

  // Tabler UI SCSS
  var lib_tabler = gulp.src([
    '../../node_modules/tabler-ui/LICENSE*'
  ]).pipe(gulp.dest('./assets/lib/tabler-ui'))

  var lib_tabler_scss = gulp.src([
    '../../node_modules/tabler-ui/src/source/assets/scss/**/*'
  ]).pipe(gulp.dest('./assets/scss/tabler-ui'))

  // Feather Icons
  var lib_feather = gulp.src([
    '../../node_modules/feather-icons/LICENSE*',
    '../../node_modules/feather-icons/dist/feather.min.*'
  ]).pipe(gulp.dest('./assets/lib/feather'))

  var lib_feather_icons = gulp.src([
    '../../node_modules/feather-icons/dist/icons/*'
  ]).pipe(gulp.dest('./assets/lib/feather/icons'))

  // Font Awesome
  var lib_fontawesome = gulp.src([
    '../../node_modules/font-awesome/css/**/*'
  ]).pipe(gulp.dest('./assets/lib/font-awesome'))

  var lib_fontawesome_fonts = gulp.src([
    '../../node_modules/font-awesome/fonts/**/*'
  ]).pipe(gulp.dest('./assets/lib/font-awesome/fonts'))

  // JQuery Easing
  var lib_easing = gulp.src([
    '../../node_modules/jquery.easing/LICENSE*',
    '../../node_modules/jquery.easing/*.min.js'
  ]).pipe(gulp.dest('./assets/lib/easing'))

  // Simplelightbox
  var lib_simplelightbox = gulp.src([
    '../../node_modules/simplelightbox/LICENSE*',
    '../../node_modules/simplelightbox/dist/*.min.css',
    '../../node_modules/simplelightbox/dist/*.min.js',
    '../../node_modules/simplelightbox/dist/*.scss'
  ]).pipe(gulp.dest('./assets/lib/simple-lightbox'))

  // Simple Parallax JS
  var lib_simplelightbox = gulp.src([
    '../../node_modules/simple-parallax-js/LICENSE*',
    '../../node_modules/simple-parallax-js/dist/*.min.js'
  ]).pipe(gulp.dest('./assets/lib/simple-parallax'))

  // Waypoints
  var lib_waypoints = gulp.src([
    '../../node_modules/waypoints/licenses.txt',
    '../../node_modules/waypoints/lib/jquery.waypoints.min.js'
  ]).pipe(gulp.dest('./assets/lib/waypoints'))

  // Waypoints Shortcuts
  var lib_waypoints_shortcuts = gulp.src([
    '../../node_modules/waypoints/lib/shortcuts/*.min.js'
  ]).pipe(gulp.dest('./assets/lib/waypoints/shortcuts'))

  // Vendors
  return merge(
    lib_jquery,
    lib_bootstrap,
    lib_tabler,
    lib_tabler_scss,
    lib_fontawesome,
    lib_fontawesome_fonts,
    lib_feather,
    lib_feather_icons,
    lib_easing,
    lib_simplelightbox,
    lib_waypoints,
    lib_waypoints_shortcuts
  );
}

function styles() {
  var tabler_ui = gulp.src('./assets/scss/bundle.scss', { base: '.' })
    .pipe(sass({
      precision: 8,
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: pkg.browserslist,
      cascade: false
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./assets/css/'))

    .pipe(rtlcss())
    .pipe(rename('style.rtl.css'))
    .pipe(gulp.dest('./assets/css/'));

  var theme = gulp.src('./assets/scss/theme/theme.scss', { base: '.' })
    .pipe(sass({
      precision: 8,
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: pkg.browserslist,
      cascade: false
    }))
    .pipe(rename('theme.css'))
    .pipe(gulp.dest('./assets/css/'))

    .pipe(rtlcss())
    .pipe(rename('theme.rtl.css'))
    .pipe(gulp.dest('./assets/css/'));

  return merge(
    tabler_ui,
    theme
  );
}

// CSS task
function css() {
  return gulp
    .src("./assets/scss/theme.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./assets/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./assets/css"))
  // .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './assets/js/*.js',
      '!./assets/js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/js'))
  // .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch("./js/**/*", js);
  gulp.watch("./**/*.html", browserSyncReload);
}

// gulp.task("default", gulp.parallel('vendor'));

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css, js));
const watch = gulp.series(build, gulp.parallel(watchFiles));
// const jekyll = gulp.series(jekyll);

// Export tasks
exports.modules = modules;
exports.styles = styles;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
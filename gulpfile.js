var gulp = require("gulp"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync").create(),
  babel = require("gulp-babel"),
  plumber = require("gulp-plumber"),
  concat = require("gulp-concat");

// A simple task to reload the page
function reload(done) {
  browserSync.reload();
  done();
}

var paths = {
  styles: {
    // by using styles/**/*.sass we're telling gulp to check all folders for any sass file
    src: "src/scss/*.scss",
    // compiled files will end up in whichever folder it's found in (partials are not compiled)
    dest: "src/css"
  },
  html: {
    src: "src/*.html"
  },
  js: {
    dependencies: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/lodash/lodash.min.js'
    ],
    temp_files: [
      './tmp/main.deps.js',
      './tmp/main.build.js'
    ],
    deps_filename: "main.deps.js",
    src: "src/components/*.js",
    temp: "tmp",
    dest: "src/js",
    filename: "main.build.js",
  }
};
function style() {
  return (
    gulp
      .src(paths.styles.src)
      // Initialize sourcemaps before compilation starts
      .pipe(sourcemaps.init())
      .pipe(sass())
      .on("error", sass.logError)
      // Use postcss with autoprefixer and compress the compiled file using cssnano
      .pipe(postcss([autoprefixer(), cssnano()]))
      // Now add/write the sourcemaps
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.styles.dest))
      // Add browsersync stream pipe after compilation
      .pipe(browserSync.stream())
  );
}
function jsDeps(done) {
  return (
    gulp
      // An array of dependencies. Use minified versions
      // here since we aren't processing these files.
      .src(paths.js.dependencies)
      // Combine these files into a single main.deps.js file.
      .pipe(concat(paths.js.deps_filename))
      // Save the concatenated file to the tmp directory.
      .pipe(gulp.dest(paths.js.temp))
  );
}
function jsBuild(done) {
  return (
    gulp
      .src(paths.js.src)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(concat(paths.js.filename))
      .pipe(babel({
        presets: [
          ['@babel/env', {
            modules: false
          }]
        ]
      }))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(paths.js.temp))
  );
}
function jsConcat(done) {
  return (
    gulp
      .src(paths.js.temp_files)
      .pipe(plumber())
      // Concatenate the third-party libraries and our 
      // homegrown components into a single main.js file.
      .pipe(concat('main.js'))
      .pipe(gulp.dest(paths.js.dest))
  );
}
function watch() {
  // Add browsersync initialization at the start of the watch task
  browserSync.init({
    // You can tell browserSync to use this directory and serve it as a mini-server
    server: {
      baseDir: "./src"
    }
    // If you are already serving your website locally using something like apache
    // You can use the proxy setting to proxy that instead
    // proxy: "yourlocal.dev"
  });
  gulp.watch(paths.styles.src, style);
  gulp.watch(paths.html.src, reload);
  gulp.watch(paths.js.src, gulp.series(jsDeps, jsBuild, jsConcat));
}

// We don't have to expose the reload function
// It's currently only useful in other functions
// Don't forget to expose the task!
exports.watch = watch

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;

// Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
var build = gulp.parallel(style, watch);

// You can still use `gulp.task` to expose tasks
// gulp.task('build', build);

// Define default task that can be called by just running `gulp` from cli
gulp.task('default', build);
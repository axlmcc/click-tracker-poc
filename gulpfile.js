var gulp = require("gulp"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync").create(),
  babel = require("gulp-babel"),
  plumber = require("gulp-plumber"),
  concat = require("gulp-concat"),
  jsConfig = require("./src/config");

// A simple task to reload the page
function reload(done) {
  browserSync.reload();
  done();
}

const srcDir = './src';
const tmpDir = './tmp';
const destDir = './src/js';

var config = {
  styles: {
    // by using styles/**/*.sass we're telling gulp to check all folders for any sass file
    src: "src/scss/*.scss",
    // compiled files will end up in whichever folder it's found in (partials are not compiled)
    dest: "src/css"
  },
  html: {
    src: "src/*.html"
  },
  js: jsConfig,
  js_src: {
    src: "src/components/*.js"
  }
};
function style() {
  return (
    gulp
      .src(config.styles.src)
      // Initialize sourcemaps before compilation starts
      .pipe(sourcemaps.init())
      .pipe(sass())
      .on("error", sass.logError)
      // Use postcss with autoprefixer and compress the compiled file using cssnano
      .pipe(postcss([autoprefixer(), cssnano()]))
      // Now add/write the sourcemaps
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(config.styles.dest))
      // Add browsersync stream pipe after compilation
      .pipe(browserSync.stream())
  );
}
function jsDeps(done) {
  // Loop through the JS Config array and create a Gulp task for
  // each object.
  const tasks = jsConfig.map((config) => {
    return (done) => {
      // Create an array of files from the `deps` property.
      const deps = (config.deps || []).map(f => {
        // If the filename begins with ~ it is assumed the file is
        // relative to node_modules. The filename must also be
        // appended with .js.
        if (f[0] == '~') {
          return `./node_modules/${f.slice(1, f.length)}.js`
        } else {
          return `${srcDir}/${f}.js`
        }
      });
      // If we don't exit in the case that there is no deps property
      // we will hit an error and Gulp will abandon other tasks, so
      // we need to gracefully fail if the config option is missing.
      if (deps.length == 0) {
        done();
        return;
      }
      // Build the temporary file based on the config name property,
      // i.e. [name].deps.js.
      return (
        gulp
          .src(deps)
          .pipe(concat(`${config.name}.deps.js`))
          .pipe(gulp.dest(tmpDir))
      );
    }
  });

  return gulp.parallel(...tasks, (parallelDone) => {
    parallelDone();
    done();
  })();
}

/**
 *  jsBuild() is identical to jsDeps() with a few exceptions:
 *
 *    1. It looks at the `files` property (not the `deps` property).
 *    2. It processes the concatenated bundle with Babel.
 *    3. It does not support hte tilde importer because we assume
 *       all self-authored files are within the source directory.
 *    4. Temp files are named [name].build.js
 */
function jsBuild(done) {
  const tasks = jsConfig.map((config) => {
    return (done) => {
      const files = (config.files || []).map(f => `${srcDir}/${f}.js`);
      if (files.length == 0) {
        done();
        return;
      }
      return (
        gulp
          .src(files)
          .pipe(plumber())
          .pipe(concat(`${config.name}.build.js`))
          .pipe(babel({
            presets: [
              ['@babel/env', {
                modules: false
              }]
            ]
          }))
          .pipe(gulp.dest(tmpDir))
      );
    }
  });
  return gulp.parallel(...tasks, (parallelDone) => {
    parallelDone();
    done();
  })();
}

function jsConcat(done) {
  const tasks = jsConfig.map((config) => {
    return (done) => {
      const files = [
        `${tmpDir}/${config.name}.deps.js`,
        `${tmpDir}/${config.name}.build.js`
      ];
      // The allowEmpty option means the task won't fail if
      // one of the temp files does not exist
      return (
        gulp
          .src(files, { allowEmpty: true })
          .pipe(plumber())
          .pipe(concat(`${config.name}.js`))
          .pipe(gulp.dest(destDir))
      );
    }
  });
  return gulp.parallel(...tasks, (parallelDone) => {
    parallelDone();
    done();
  })();
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
  gulp.watch(config.styles.src, style);
  gulp.watch(config.html.src, reload);
  gulp.watch(config.js_src.src, gulp.series(gulp.parallel(jsDeps, jsBuild), jsConcat));
}

// We don't have to expose the reload function
// It's currently only useful in other functions
// Don't forget to expose the task!
exports.watch = watch;

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
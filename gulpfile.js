// Import everything important
const gulp = require('gulp');
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');

// For CSS -> CSS
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// HTML
const htmlmin = require('gulp-htmlmin');

// JavaScript/TypeScript
const browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// Define Important Varaibles
const src = './src';
const dest = './dist';

// Function for reload the Browser
const reload = (done) => {
    browserSync.reload();
    done();
};

// Function for serve the dev server in borwsaer
const serve = (done) => {
    browserSync.init({
        server: {
            baseDir: `${dest}`
        }
    });
    done();
};

// Compile css into css with gulp
const css = () => {
    // Find css
    return gulp.src(`${src}/css/*.css`)
        // Init Plumber
        .pipe(plumber())
        // Lint CSS
        .pipe(postcss())
        // Start Source Map
        .pipe(sourcemaps.init())
        // add SUffix
        .pipe(rename({ basename: 'main', suffix: ".min" }))
        // Add Autoprefixer & cssNano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Write Source Map
        .pipe(sourcemaps.write(''))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}/css`))
        // Reload Page
        .pipe(browserSync.stream());
};

// Compile .html to minify .html
const html = () => {
    // Find css
    return gulp.src(`${src}/*.html`)
        // Init Plumber
        .pipe(plumber())
        // Compile css -> CSS
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            html5: true,
            removeEmptyAttributes: true,
            removeTagWhitespace: true,
            sortAttributes: true,
            sortClassName: true
        }))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}`));
};

// Compile .js to minify .js
const script = () => {
    // Find css
    return gulp.src(`${src}/js/*.js`)
        // Init Plumber
        .pipe(plumber(((error) => {
            gutil.log(error.message);
        })))
        // Start useing source maps
        .pipe(sourcemaps.init())
        // concat
        .pipe(concat('concat.js'))
        // Use Babel
        .pipe(babel())
        // JavaScript Lint
        .pipe(jshint())
        // Report of jslint
        .pipe(jshint.reporter('jshint-stylish'))
        // Add browser Support
        .pipe(browserify({
            insertGlobals: true
        }))
        // add SUffix
        .pipe(rename({ basename: 'main', suffix: ".min" }))
        // Write Sourcemap
        .pipe(sourcemaps.write(''))
        // Write everything to destination folder
        .pipe(gulp.dest(`${dest}/js`))
        // Update Browser
        .pipe(browserSync.stream());
};

// Function to watch our Changes and refreash page
const watch = () => gulp.watch([`${src}/*.html`, `${src}/js/**/*.js`, `${src}/css/*.css`], gulp.series(css, script, html, reload));

// All Tasks for this Project
const dev = gulp.series(css, script, html, serve, watch);

// Just Build the Project
const build = gulp.series(css, script, html);

// Default function (used when type gulp)
exports.dev = dev;
exports.build = build;
exports.default = build;

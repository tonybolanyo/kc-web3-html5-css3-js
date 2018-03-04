var browserSync = require("browser-sync").create();
var gulp = require("gulp");
var gutil = require('gulp-util');
var notify = require("gulp-notify");
var size = require('gulp-size');
var sourcemaps = require("gulp-sourcemaps");

// for html
var htmlmin = require("gulp-htmlmin");

// for css
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var postcss = require("gulp-postcss");
var purifycss = require("gulp-purifycss");
var sass = require("gulp-sass");
var stylelint = require('stylelint');

// for images
var imagemin = require("gulp-imagemin");

// for JavaScript
var browserify = require("browserify");
var buffer = require("gulp-buffer");
var tap = require("gulp-tap");
var uglify = require("gulp-uglify");

// default task
gulp.task("default", ["build"], function() {

    // local develop server
    browserSync.init({
        server: "./dist/"
    });

    // watch html files to reload browser
    gulp.watch(["src/*.html", "src/**/*.html"], ["html"]);

    // watch styles folder to compile sass files
    gulp.watch(["src/css/*.scss", "src/css/**/*.scss"], ["css"]);

    // watch js folder to compile JavaScript files
     gulp.watch(["src/js/*.js", "src/js/**/*.js"], ["js"]);

});

gulp.task("build", ["fonts", "images", "videos", "html", "css"]);

// compile html files
gulp.task("html", function () {
    gulp.src("src/*.html")
        // minimize html files
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        // copy to dist folder
        .pipe(gulp.dest("dist"))
        /// and reload browsers
        .pipe(browserSync.stream());
});

// compile css styles from sass files
gulp.task("css", function () {
    gulp.src("src/css/styles.scss")
        // capture sourcemaps
        .pipe(sourcemaps.init())
        // compile sass
        .pipe(sass().on("error", sass.logError))
        .pipe(size({
            showFiles: true
        }))
        .pipe(size({
            gzip: true,
            showFiles: true
        }))
        .pipe(purifycss(["src/js/*.js", "src/js/**/*.js", "src/*.html"]))
        .pipe(postcss([
            // add prefixes to old browsers compatibility
            autoprefixer(),
            // compress compiled css
            cssnano()
        ]))
        .pipe(size({
            showFiles: true
        }))
        .pipe(size({
            gzip: true,
            showFiles: true
        }))
        // save sourcemaps in css folder
        .pipe(sourcemaps.write("./"))
        // copy to dist folder
        .pipe(gulp.dest("dist/css/"))
        // and reload browsers
        .pipe(browserSync.stream());
});

// lint scss styles
gulp.task("css:lint", function () {
    gulp.src(["src/css/*.scss"])
        .pipe(postcss([
            // lint style files
            stylelint()
        ]))
});

// images
gulp.task("images", function() {
    gulp.src(["src/images/*", "src/images/**/*", "!src/images/*.svg"])
        .pipe(imagemin())
        .pipe(gulp.dest("dist/images/"));
});

// videos
gulp.task("videos", function() {
    gulp.src(["src/videos/*", "src/videos/**/*"])
        .pipe(gulp.dest("dist/videos/"));
});

gulp.task("fonts", function() {
    gulp.src(["src/fonts/*"])
        .pipe(gulp.dest("dist/fonts/"));
});

// compile and generate inly one js file
gulp.task("js", function () {
    gulp.src("src/js/main.js")
        // tap allows to apply a function to every file
        .pipe(tap(function (file) {
            // replace content file with browserify result
            file.contents = browserify(file.path, {
                debug: true
            }) // new browserify instance
                .transform("babelify", {
                    presets: ["es2015"]
                }) // ES6 -> ES5
                .bundle() // compile
                .on("error", (error) => notify().write(error)) // treat errors
        }))
        // back file to gulp buffer to apply next pipe
        .pipe(buffer())
        .on("finish", () => gutil.log('Original size:'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(size({
            gzip: true,
            showFiles: true
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        // minimize and ofuscate JavaScript file
        .pipe(uglify())
        .on("finish", () => gutil.log('Size after uglify:'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(size({
            gzip: true,
            showFiles: true
        }))
        // write sourcemap o same directory
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist/js/"))
        // and reload browsers
        .pipe(browserSync.stream())
});

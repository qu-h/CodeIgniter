var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    // uglifyes = require('uglify-es'),
    // composer = require('gulp-uglify/composer'),
    //uglify = composer(uglifyes, console),
    // uglify = require('gulp-uglify'),
    gutil = require('gulp-util');
var resourcePath = '';

// Minifies SCSS
gulp.task('sass', function() {
    return gulp.src(resourcePath+'scss/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        // .pipe(uglify({mangle: false}))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })

        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('styles.min.css'))
        // .pipe(sass())


        //.pipe(plumber()) // Deal with errors.
        //.pipe($.sourcemaps.init()) // Wrap tasks in a sourcemap.
        // .pipe($.sass({ // Compile Sass using LibSass.
        //     errLogToConsole: true,
        //     outputStyle: "expanded" // Options: nested, expanded, compact, compressed
        // }))
        // .pipe($.cleanCss({
        //     keepSpecialComments: '*',
        //     spaceAfterClosingBrace: true
        // }))
        //.pipe(rename({ suffix: '.min' })) // Append our suffix to the name
        .pipe(gulp.dest('css'))
});

// Minifies JS
gulp.task('js', function(){
    return gulp.src([resourcePath+'javascript/lib/*.js',resourcePath+'javascript/*.js'])
        .pipe(concat('smart-admin-ict.js'))
        //.pipe(uglify())
        // .on('error', function (err) {
        //     gutil.log(gutil.colors.red('[Error]'), err.toString());
        // })
        .pipe(gulp.dest('public/js'))
});

gulp.task('default', function() {
    gulp.start(['sass','js']);
});

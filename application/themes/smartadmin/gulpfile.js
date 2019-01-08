var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    // uglifyes = require('uglify-es'),
    // composer = require('gulp-uglify/composer'),
    //uglify = composer(uglifyes, console),
    // uglify = require('gulp-uglify'),
    gutil = require('gulp-util');
var resourcePath = '';
var gitPublicResource = 'D:/WWW/quanict.github.io/themes/SmartAdmin';

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
        .pipe(gulp.dest(gitPublicResource+'/css'))
});

// Minifies JS
gulp.task('js', function(){
    $script_files = [

        //PACE LOADER - turn this on if you want ajax loading to show (caution: uses lots of memory on iDevices)
        'js/libs/jquery-2.1.1.min.js',
        'js/plugin/pace/pace.min.js',
        'js/libs/jquery-ui-1.10.3.min.js',



        'js/plugin/jquery-validate/jquery.validate.min.js',
        'js/plugin/masked-input/jquery.maskedinput.min.js',

        // EASY PIE CHARTS
        'js/plugin/easy-pie-chart/jquery.easy-pie-chart.min.js',

        // SPARKLINES
        'js/plugin/sparkline/jquery.sparkline.min.js',

        //IMPORTANT: APP CONFIG
        'js/app.config.js',

        //MAIN APP JS FILE
        'js/app.min.js',
        'js/tables.js',
        'js/demo.min.js',

        'js/speech/voicecommand.min.js',

        //SmartChat UI : plugin
        'js/smart-chat-ui/smart.chat.ui.min.js',
        'js/smart-chat-ui/smart.chat.manager.min.js',

        'js/plugin/select2/select2.min.js',
        'js/smartwidgets/jarvis.widget.min.js',


        'js/plugin/datatables/jquery.dataTables.min.js',
        'js/plugin/datatables/dataTables.bootstrap.min.js',



        'js/bootstrap/bootstrap.min.js',
        "js/ict.js",

    ];
    return gulp.src($script_files)
        .pipe(concat('smart-admin-ict.js'))
        //.pipe(uglify())
        // .on('error', function (err) {
        //     gutil.log(gutil.colors.red('[Error]'), err.toString());
        // })
        .pipe(gulp.dest(gitPublicResource+'/js'))
});

gulp.task('copy-resource', function(){
    gulp.src(resourcePath+'img/*').pipe(gulp.dest(gitPublicResource+'/img'));
    gulp.src(resourcePath+'img/avatars/*').pipe(gulp.dest(gitPublicResource+'/img/avatars'));
    gulp.src(resourcePath+'images/*').pipe(gulp.dest(gitPublicResource+'/images'));
    gulp.src(resourcePath+'fonts/*').pipe(gulp.dest(gitPublicResource+'/fonts'));
});


gulp.task('default', function() {
    gulp.start(['sass','js']);
    gulp.start(['copy-resource']);
});

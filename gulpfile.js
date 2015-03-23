/// <vs BeforeBuild='default' />
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var del = require('del');

gulp.task('default', ['clean'], function () {
    gulp.start('styles', 'scripts', 'bsfonts');

});

gulp.task('bsfonts', function () {
    return gulp.src(['bower_components/bootstrap/dist/fonts/*'], {
        base: 'bower_components/bootstrap/dist/fonts'
    }).pipe(gulp.dest('dist/fonts'));
});

gulp.task('styles', function() {
    return gulp.src([
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/bootstrap/dist/css/bootstrap-theme.css',
            'bower_components/codemirror/lib/codemirror.css',
            'bower_components/codemirror/addon/dialog/dialog.css',
            'bower_components/codemirror/addon/search/matchesonscrollbar.css',
            'bower_components/codemirror/addon/fold/foldgutter.css',
            'bower_components/codemirror/addon/hint/show-hint.css',
            'bower_components/codemirror/theme/monokai.css'
        ])
        .pipe(concat('site.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('clean', function(cb) {
    del(['dist/js', 'dist/css', 'dist/fonts'], cb);
});

gulp.task('scripts', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/codemirror/lib/codemirror.js',
        'bower_components/codemirror/addon/dialog/dialog.js',
        'bower_components/codemirror/addon/search/searchcursor.js',
        'bower_components/codemirror/addon/search/search.js',
        'bower_components/codemirror/addon/search/matchesonscrollbar.js',
        'bower_components/codemirror/addon/scroll/annotatescrollbar.js',
        'bower_components/codemirror/addon/edit/closetag.js',
        'bower_components/codemirror/addon/fold/foldcode.js',
        'bower_components/codemirror/addon/fold/foldgutter.js',
        'bower_components/codemirror/addon/fold/xml-fold.js',
        'bower_components/codemirror/addon/hint/show-hint.js',
        'bower_components/codemirror/addon/hint/xml-hint.js',
        'bower_components/codemirror/addon/edit/closetag.js',
        'bower_components/codemirror/addon/edit/matchtags.js',
        'bower_components/codemirror/addon/selection/active-line.js',
        'bower_components/codemirror/mode/xml/xml.js',
        'bower_components/angular/angular.js',
        'src/app.js'
    ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});
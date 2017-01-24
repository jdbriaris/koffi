var gulp = require('gulp');
var del = require('del');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');
var browserSync = require('browser-sync').create();

var port = 8080;

var paths = {
    www: '/www',
    src: './src'
};

gulp.task('clean', function (cb) {
    return del(paths.www, cb);
});

gulp.task('webpack', shell.task('webpack --progress --colors'));
gulp.task('webpack-app', shell.task('webpack --config ./config/webpack.app.js --progress --colors'));

gulp.task('serve', function() {
    return nodemon({
        script: './server.js',
        ext: 'js',
        env: {
            PORT: port
        },
        args: [paths.www],
        watch: __dirname + './server.js'
    })
        .on('start', function() {
            if (browserSync.active) {
                return;
            }
            browserSync.init({
                proxy: 'localhost:' + port
            });

            gulp.watch(paths.src + '/**/*.+(html|ts|scss)').on('change', gulp.series('webpack-app', browserSync.reload));
        })
        .on('restart', function () {
            browserSync.reload();
        });
});

gulp.task('develop', gulp.series('clean', 'webpack', 'serve'));

gulp.task('build', gulp.series('clean', 'webpack', shell.task('cordova build')));

gulp.task('android', shell.task('cordova emulate android'));
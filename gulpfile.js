var gulp = require('gulp');
var del = require('del');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');
var browserSync = require('browser-sync').create();
var ts = require('gulp-typescript');

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

            gulp.watch(paths.src + '/**/*.+(html|ts|scss)', '!/**/*.spec.ts').on('change', gulp.series('webpack-app', browserSync.reload));
        })
        .on('restart', function () {
            browserSync.reload();
        });
});



gulp.task('build', gulp.series('clean', 'webpack', shell.task('cordova build')));

gulp.task('android', shell.task('cordova emulate android'));

//region Tests

gulp.task('transpile-tests', function() {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src('./src/**/*.spec.ts')
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('test/'));
});

gulp.task('watch-tests', function() {
    gulp.watch('./src/**/*.spec.ts').on('change', gulp.series('transpile-tests'));
});

gulp.task('tests', gulp.parallel( shell.task('karma start'), gulp.series('transpile-tests', 'watch-tests')));

//endregion

gulp.task('develop', gulp.parallel('tests', gulp.series('clean', 'webpack', 'serve')));

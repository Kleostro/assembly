const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const typograf = require('gulp-typograf');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
// const groupMedia = require('gulp-group-css-media-queries');
// const babel = require('gulp-babel');
// const imageMin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');
const changed = require('gulp-changed');


const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
};

const serverSettings = {
    livereload: true,
    open: true
};

const svgSpriteSettings = {
    mode: {
        stack: {
            sprite: '../sprite.svg'
        }
    }
};

const plumberSettings = (title) => {

    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: 'Frog'
        })
    };
};

gulp.task('clean:dev', function (done) {
    if (fs.existsSync('build')) return gulp.src('build', { read: false }).pipe(clean({ force: true }))
    done()
});

gulp.task('html:dev', function () {
    return gulp.src(['src/html/**/*.html', '!src/html/blocks/*.html'])
        .pipe(changed('build', { hasChanged: changed.compareContents }))
        .pipe(plumber(plumberSettings('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(typograf({ locale: ['ru', 'en-US'] }))
        .pipe(gulp.dest('build'))
});

gulp.task('sass:dev', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(changed('build/css'))
        .pipe(plumber(plumberSettings('Styles')))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('build/css'))
});

gulp.task('img:dev', function () {
    return gulp.src('src/img/**/*')
        .pipe(changed('build/img'))
        // .pipe(imageMin({ verbose: true }))
        .pipe(gulp.dest('build/img'))
});

gulp.task('svgSprite:dev', function () {
    return gulp.src('src/img/svg/**/*.svg')
        .pipe(svgSprite(svgSpriteSettings))
        .pipe(gulp.dest('build/img'))
});

gulp.task('fonts:dev', function () {
    return gulp.src('src/fonts/**/*')
        .pipe(changed('build/fonts'))
        .pipe(gulp.dest('build/fonts'))
});

gulp.task('resources:dev', function () {
    return gulp.src('src/resources/**/*')
        .pipe(changed('build/resources'))
        .pipe(gulp.dest('build/resources'))
});

gulp.task('js:dev', function () {
    return gulp.src('src/js/*.js')
        .pipe(changed('build/js'))
        .pipe(plumber(plumberSettings('JS')))
        // .pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('build/js'))
});

gulp.task('server:dev', function () {
    return gulp.src('build')
        .pipe(server(serverSettings))
});


gulp.task('watch:dev', function () {
    gulp.watch('src/**/*.html', gulp.parallel('html:dev'))
    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass:dev'))
    gulp.watch('src/img/**/*', gulp.parallel('img:dev'))
    gulp.watch('src/img/svg/*', gulp.parallel('svgSprite:dev'))
    gulp.watch('src/fonts/**/*', gulp.parallel('fonts:dev'))
    gulp.watch('src/resources/**/*', gulp.parallel('resources:dev'))
    gulp.watch('src/js/**/*.js', gulp.parallel('js:dev'))
});

const gulp = require('gulp');
const htmlclean = require('gulp-htmlclean');
const fileInclude = require('gulp-file-include');
const typograf = require('gulp-typograf');
const webpHTML = require('gulp-webp-html');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const groupMedia = require('gulp-group-css-media-queries');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');
const autoprefixer = require('gulp-autoprefixer');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
// const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imageMin = require('gulp-imagemin');
const webp = require('gulp-webp');
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

const autoprefixerSettings = {
    cascade: false,
    grid: true,
    overrideBrowserslist: ["last 5 versions"]
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

gulp.task('clean:docs', function (done) {
    if (fs.existsSync('docs')) return gulp.src('docs', { read: false }).pipe(clean({ force: true }))
    done()
});

gulp.task('html:docs', function () {
    return gulp.src(['src/html/**/*.html', '!src/html/blocks/*.html'])
        .pipe(changed('docs'))
        .pipe(plumber(plumberSettings('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(webpHTML())
        .pipe(typograf({ locale: ['ru', 'en-US'] }))
        .pipe(htmlclean())
        .pipe(gulp.dest('docs'))
});

gulp.task('sass:docs', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(changed('docs/css'))
        .pipe(plumber(plumberSettings('Styles')))
        // .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(groupMedia())
        .pipe(sass())
        .pipe(autoprefixer(autoprefixerSettings))
        .pipe(webpCss())
        .pipe(csso())
        // .pipe(sourceMaps.write())
        .pipe(gulp.dest('docs/css'))
});

gulp.task('img:docs', function () {
    return gulp.src('src/img/**/*')
        .pipe(changed('docs/img'))
        .pipe(webp())
        .pipe(gulp.dest('docs/img'))
        .pipe(gulp.src('src/img/**/*'))
        .pipe(changed('docs/img'))
        .pipe(imageMin({ verbose: true }))
        .pipe(gulp.dest('docs/img'))
});

gulp.task('svgSprite:docs', function () {
    return gulp.src('src/img/svg/*.svg')
        .pipe(svgSprite(svgSpriteSettings))
        .pipe(gulp.dest('docs/img'))
});

gulp.task('fonts:docs', function () {
    return gulp.src('src/fonts/**/*')
        .pipe(changed('docs/fonts'))
        .pipe(gulp.dest('docs/fonts'))
});

gulp.task('resources:docs', function () {
    return gulp.src('src/resources/**/*')
        .pipe(changed('docs/resources'))
        .pipe(gulp.dest('docs/resources'))
});

gulp.task('js:docs', function () {
    return gulp.src('src/js/*.js')
        .pipe(changed('docs/js'))
        .pipe(plumber(plumberSettings('JS')))
        .pipe(babel())
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('docs/js'))
});

gulp.task('server:docs', function () {
    return gulp.src('docs')
        .pipe(server(serverSettings))
});

const path = require('path')
const fs = require('fs')
const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')
sass.compiler = require('sass')
const notify = require('gulp-notify')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const autoImports = require('gulp-auto-imports')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const videExtentions = require('video-extensions')
const browserSync = require('browser-sync').create()


const SRC_PATH = 'src'
const BUILD_PATH = 'build'
const ASSETS_PATH = path.join(BUILD_PATH, 'assets')

function autoImport() {
    return src(path.join(SRC_PATH, 'blocks/*.scss'))
    .pipe(autoImports({ 
        format: '@import "$path";',
        dest: SRC_PATH,
        fileName: '_blocks.scss',
        retainOrder: true,
    }))
    .pipe(dest(SRC_PATH))
}

function compileSCSS() {
    return src(path.join(SRC_PATH, '**/*.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.join(ASSETS_PATH, '/css')))
}

function copyHTML() {
    src(path.join(SRC_PATH, 'html', 'index.html'))
    .pipe(dest(BUILD_PATH))

    const HTMLArray = fs.readdirSync(path.join(SRC_PATH, 'html'))
    const filteredHTMLArray = HTMLArray.filter(value => value !== 'index.html')

    return src(filteredHTMLArray.map(htmlFile => path.join(SRC_PATH, 'html', htmlFile)))
    .pipe(dest(path.join(ASSETS_PATH, 'html')))
}

function copyVideos() {
    return src(videExtentions.map(videoExtention => path.join(SRC_PATH, `blocks/*.${videoExtention}`)))
    .pipe(dest(path.join(ASSETS_PATH, 'videos')))
}

function copyImages() {
    return src([
                path.join(SRC_PATH, 'blocks/*.png'),
                path.join(SRC_PATH, 'blocks/*.jpg'), 
                path.join(SRC_PATH, 'blocks/*.jpeg')
            ])
    .pipe(dest(path.join(ASSETS_PATH, 'images')))
}

function watchChanges() {
    browserSync.init({
        server: {
            baseDir: BUILD_PATH
        }
    })

    watch(path.join(SRC_PATH, '**/*.scss'), series(autoImport, compileSCSS))
    watch(path.join(SRC_PATH, 'html', '*.html'), copyHTML)
    watch(path.join([
        path.join(SRC_PATH, 'blocks/*.png'),
        path.join(SRC_PATH, 'blocks/*.jpg'), 
        path.join(SRC_PATH, 'blocks/*.jpeg')
    ], copyImages))
    watch(videExtentions.map(videoExtention => path.join(SRC_PATH, `blocks/*.${videoExtention}`)), copyVideos)
}

exports.default = series(autoImport, compileSCSS, copyImages, copyVideos, copyHTML, watchChanges)
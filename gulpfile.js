const path = require('path')
const fs = require('fs')
const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')
sass.compiler = require('sass')
const autoImports = require('gulp-auto-imports')
const videExtentions = require('video-extensions')


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
        .pipe(sass.sync())
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

exports.compileSCSS = compileSCSS
exports.default = autoImport
exports.copyHTML = copyHTML
exports.copyVideos = copyVideos
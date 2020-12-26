const path = require('path')
const fs = require('fs')
const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')
sass.compiler = require('sass')


const SRC_PATH = path.join(__dirname, 'src')
const BUILD_PATH = path.join(__dirname, 'build')
const ASSETS_PATH = path.join(BUILD_PATH, 'assets')

function compileSCSS() {
    return src(path.join(SRC_PATH, '**/*.scss'))
        .pipe(sass.sync())
        .pipe(dest(path.join(ASSETS_PATH, '/css')))
}

exports.compileSCSS = compileSCSS
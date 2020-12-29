const path = require('path')
const fs = require('fs')
const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')
sass.compiler = require('sass')
const autoImports = require('gulp-auto-imports')


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

exports.compileSCSS = compileSCSS
exports.default = autoImport
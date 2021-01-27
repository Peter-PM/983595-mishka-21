const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const csso = require("postcss-csso");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();


// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less()) // less -> css
    .pipe(postcss([
      autoprefixer(), // префиксы
      csso() // минификация
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("styles.min.css")) // style.css -> styles.min.css
    .pipe(gulp.dest("build/css")) // куда положить
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

// Scripts

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Image

const images = () => {
  return gulp.src("source/img/**/*.{jpg,svg,png}")
    .pipe(imagemin([
      imagemin.mozjpeg({
        quality: 90,
        progressive: true
      }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
}

exports.images = images;

// WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
}

exports.webp = webp;

// Sprite

const sprite = () => {
  return gulp.src("source/img/**/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,svg,png}",
    "source/css/style.css"
  ],
    {
      base: "source"
    })
    .pipe(gulp.dest("build"))
}

exports.copy = copy;

//Clean

const clean = () => {
  return del("build")
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html));
}

exports.watcher = watcher;

// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    copy,
    createWebp
  )
)

exports.build = build;


exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    copy,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
)

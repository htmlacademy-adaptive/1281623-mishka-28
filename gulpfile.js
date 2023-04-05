import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';

// Pug

export const pug2html = () => {
  return gulp
    .src(["source/pug/index.pug", "source/pug/pages/*.pug"])
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("source"));
};

// Styles

export const scss2css = () => {
  return gulp
    .src("source/scss/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("source/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "source",
    },
    cors: true,
    notify: false,
    online: true,
    open: true,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/pug/**/*.pug", gulp.series(pug2html));
  gulp.watch("source/scss/**/*.scss", gulp.series(scss2css));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  pug2html, scss2css, server, watcher
);

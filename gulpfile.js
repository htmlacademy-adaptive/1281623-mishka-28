import gulp from "gulp";
import plumber from "gulp-plumber";
import pug from "gulp-pug";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import svgSprite from "gulp-svg-sprite";
import svgmin from "gulp-svgmin";
import cheerio from "gulp-cheerio";
import replace from "gulp-replace";
import webp from "gulp-webp";
import del from "del";

// clean WEBP

export const cleanWEBP = (cb) => {
  return del("source/img/webp").then(() => {
    cb();
  });
};

// WEBP

export const createWEBP = () => {
  return gulp
    .src(["source/img/**/*.{png,jpg}", "!source/img/favicons/**/*", "!source/img/sprite/**/*"])
    .pipe(
      webp({
        quality: 80,
      })
    )
    .pipe(gulp.dest("source/img/webp"));
};

// SVG sprite

export const spriteSVG = () => {
  return gulp
    .src("source/img/sprite/svg/*.svg")
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
          indent: 2,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[opacity]").removeAttr("opacity");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: {
          xmlMode: true,
        },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: "./",
            sprite: "sprite.svg",
          },
        },
      })
    )
    .pipe(gulp.dest("source/img/sprite"));
};

// Pug

export const pug2html = () => {
  return gulp
    .src(["source/pug/index.pug", "source/pug/pages/*.pug"])
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("source"));
};

// Styles

export const styles = () => {
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
};

// Watcher

const watcher = () => {
  gulp.watch("source/pug/**/*.pug", gulp.series(pug2html));
  gulp.watch("source/scss/**/*.scss", gulp.series(styles));
	gulp.watch("source/img/**/*.{png,jpg}", gulp.series(cleanWEBP, createWEBP));
  gulp.watch("source/img/sprite/svg/*.svg", gulp.series(spriteSVG));
  gulp.watch("source/*.html").on("change", browser.reload);
};

export default gulp.series(pug2html, styles, cleanWEBP, createWEBP, spriteSVG, server, watcher);

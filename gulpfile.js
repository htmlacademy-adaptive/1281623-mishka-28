import gulp from "gulp";
import plumber from "gulp-plumber";
import htmlmin from "gulp-htmlmin";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import csso from "postcss-csso";
import terser from "gulp-terser";
import squoosh from "gulp-libsquoosh";
import svgmin from "gulp-svgmin";
import svgstore from "gulp-svgstore";
import cheerio from "gulp-cheerio";
import rename from "gulp-rename";
import del from "del";
import gulpif from "gulp-if";
import browser from "browser-sync";

const isBuild = true;

// Pug

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(gulpif(isBuild, htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest("build"));
};

// Styles

export const styles = () => {
  return gulp
    .src("source/scss/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(gulpif(isBuild, postcss([autoprefixer(), csso()])))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Scripts

const scripts = () => {
  return gulp
    .src("source/js/*.js")
    .pipe(gulpif(isBuild, terser()))
    .pipe(gulp.dest("build/js"))
    .pipe(browser.stream());
};

// Images

const optimizeImages = () => {
  return gulp
    .src("source/img/**/*.{png,jpg}")
    .pipe(gulpif(isBuild, squoosh()))
    .pipe(gulp.dest("build/img"));
};

// WEBP

const createWebp = () => {
  return gulp
    .src(["source/img/**/*.{png,jpg}", "!source/img/favicons/**/*"])
    .pipe(
      squoosh({
        webp: {},
      })
    )
    .pipe(gulp.dest("build/img/webp"));
};

// SVG

const optimizeSVG = () => {
  return gulp
    .src(["source/img/**/*.svg", "!source/img/sprite/*.svg"])
    .pipe(svgmin())
    .pipe(gulp.dest("build/img"));
};

const spriteSVG = () => {
  return gulp
    .src("source/img/sprite/*.svg")
    .pipe(svgmin())
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[opacity]").removeAttr("opacity");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
      })
    )
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

// Copy

const copyFiles = (done) => {
  return gulp
    .src(
      [
        "source/fonts/*.{woff2,woff}",
        "source/*.ico",
        "source/manifest.webmanifest",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "build",
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
  gulp.watch("source/scss/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch(
    ["source/img/**/*.svg", "!source/img/sprite/*.svg"],
    gulp.series(optimizeSVG)
  );
  gulp.watch("source/img/sprite/svg/*.svg", gulp.series(spriteSVG));
  gulp.watch("source/*.html").on("change", browser.reload);
};

// Build

export const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    scripts,
    optimizeSVG,
    spriteSVG,
    copyFiles,
    optimizeImages,
    createWebp
  ),
  server,
  watcher
);

// Default

export default gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    scripts,
    optimizeSVG,
    spriteSVG,
    copyFiles,
    optimizeImages,
    createWebp
  ),
  server,
  watcher
);

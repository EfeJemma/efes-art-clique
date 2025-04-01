const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));  // Ensure using the 'sass' compiler correctly
const browserSync = require('browser-sync').create();
const gulpSass = require('gulp-sass')(sass);

// Task to compile Sass files
gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')  // Adjust the path to your actual SCSS files
    .pipe(sass().on('error', sass.logError))  // Compile Sass and handle errors
    .pipe(gulp.dest('dist/css'));  // Adjust the output folder
});

// Task to copy Bootstrap, Font Awesome, and other JS files
function js(done) {
  gulp.src([
      './node_modules/bootstrap/dist/js/bootstrap.min.js',
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/popper.js/dist/popper.min.js'
    ])
    .pipe(gulp.dest('./assets/js/'))  // Save JS files
    .pipe(browserSync.stream());  // Browser Sync Stream
  done();  // Signal task completion
}

// Task to move Font-Awesome Fonts Folder to Assets
function fonts(done) {
  gulp.src('./node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./assets/fonts/'))  // Save fonts
  done();  // Signal task completion
}

// Task to compile Sass and Move Font-Awesome CSS
function scss(done) {
  gulp.src(['./node_modules/bootstrap/scss/bootstrap.scss', './assets/scss/*.scss', './node_modules/font-awesome/css/font-awesome.min.css'])
    .pipe(sass())  // Compile Sass to CSS
    .pipe(gulp.dest('./assets/css/'))  // Save compiled CSS
    .pipe(browserSync.stream());  // Browser Sync Stream
  done();  // Signal task completion
}

// Watch SASS, JS, and Fonts, and Start Live Server (with BrowserSync)
function liveServer(done) {
  browserSync.init({
    server: './'  // Serve the project from the current directory
  });

  gulp.watch('./assets/scss/*.scss', scss);  // Watch SASS files for changes
  gulp.watch('./assets/js/*.js', js);  // Watch JS files for changes
  gulp.watch('./assets/fonts/', fonts);  // Watch Fonts
  gulp.watch('./*.html').on('change', browserSync.reload);  // Watch HTML files for changes
  done();  // Signal task completion
}

// Default build task, runs the 'sass' task
gulp.task('build', gulp.series('sass', 'scss', 'js', 'fonts'));

// Export Tasks
exports.scss = scss;
exports.fonts = fonts;
exports.js = js;
exports.liveServer = liveServer;

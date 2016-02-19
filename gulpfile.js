var gulp = require('gulp');

gulp.task('copy-bootstrap', function () {
  return gulp.src('./bower_components/bootstrap/dist/**/*', { base: './bower_components/bootstrap/dist/' })
             .pipe(gulp.dest('./src/'));
});

gulp.task('copy-bootstrap-material', function () {
  return gulp.src('./bower_components/bootstrap-material-design/dist/**/*', { base: './bower_components/bootstrap-material-design/dist/' })
             .pipe(gulp.dest('./src/'));
});

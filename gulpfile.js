var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin');

gulp.task('sass', function() {
  return gulp.src('sass/main.sass')
  	.pipe(sass())
  	.pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
  	.pipe(gulp.dest('css'))
  	.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
	browserSync({ // Выполняем browser Sync
		server: { // Определяем параметры сервера
			baseDir: './' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('default', ['browser-sync', 'sass'], function() {
	gulp.watch('sass/*.sass', ['sass']);
	gulp.watch('./*.html', browserSync.reload);
	gulp.watch('js/*.js', browserSync.reload);
});

gulp.task('img', function() {
	return gulp.src('src-img/**')
		.pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5}),
		    imagemin.svgo({plugins: [{removeViewBox: true}]})
		]))
		.pipe(gulp.dest('img'))

})

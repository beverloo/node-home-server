// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import babelify from 'babelify';
import browserify from 'browserify';
import gulp from 'gulp';
import sftp from 'gulp-sftp';
import source from 'vinyl-source-stream';

gulp.task('default', () => {
  let babelify_options = {
    nonStandard: false,
    optional: [
      "es7.decorators"
    ]
  };

  let browserify_options = {
    debug: true,
    entries: 'src/server.js',
    transform: [
      babelify.configure(babelify_options)
    ],
  };

  return browserify(browserify_options)
      .bundle()
      .pipe(source('server.js'))
      .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', gulp.series('default', done => {
  let sftp_options = {
    auth: 'peter',
    host: '192.168.0.22',
    remotePath: '/home/pi/node/'
  };

  return gulp.src('dist/server.js')
      .pipe(sftp(sftp_options));
}));

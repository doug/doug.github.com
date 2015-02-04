/* jshint node: true */
'use strict';

var gulp = require( 'gulp' ),
    highlight = require( 'highlight.js' ),
    nib = require( 'nib' ),
    browserSync = require( 'browser-sync' ),
    $ = require( 'gulp-load-plugins' )();

gulp.task( 'default', ['dev'] );

gulp.task( 'dev', ['watch', 'serve'] );

gulp.task( 'serve', function() {
    browserSync( {
        server: {
            baseDir: './build'
        }
    } );
} );

gulp.task( 'clean', function() {
    return gulp.src( 'build/*' )
    .pipe( $.rimraf() );
} );

gulp.task( 'style', function() {
    return gulp.src( 'style/*' )
    .pipe( $.stylus( {
        use: [nib()]
    } ) )
    .pipe( gulp.dest( 'build/style' ) )
    .pipe( $.if( browserSync.active, browserSync.reload( {
        stream: true
    } ) ) );

} );

gulp.task( 'build', ['build-index', 'build-articles'] );

gulp.task( 'build-index', function() {
    return gulp.src( 'articles/*.md' )
    .pipe( $.frontMatter( {
        property: 'data'
    } ) )
    .pipe( $.wrap( { // wrap it in a template
        src: 'templates/index-item.html'
    } ) )
    .pipe( $.concat( 'index.html' ) )
    .pipe( $.wrap( { // wrap it in a template
        src: 'templates/index.html'
    } ) )
    .pipe( gulp.dest( 'build' ) );
} );

gulp.task( 'build-articles', function() {
    return gulp.src( 'articles/*.md' )
    .pipe( $.frontMatter( {
        property: 'data',
        remove: true
    } ) )
    .pipe( $.marked( { // convert the markdown
        gfm: true, // use github flavor markdown
        highlight: function(code) { // highlight the code
            return highlight.highlightAuto( code ).value;
        }
    } ) )
    .pipe( $.wrap( { // wrap it in a template
        src: 'templates/article.html'
    } ) )
    .pipe( $.rename( { // create a file with nice urls
        extname: '/index.html'
    } ) )
    .pipe( gulp.dest( 'build' ) );
} );

gulp.task( 'watch', ['build'], function() {
    gulp.watch( [
        'articles/*',
        'templates/*'
    ], ['build', browserSync.reload] );
    gulp.watch( 'style/*', ['style'] );
} );

var gulp = require( 'gulp' ),
    highlight = require( 'highlight.js' ),
    $ = require( 'gulp-load-plugins' )();

gulp.task( 'convert', function() {
    gulp.src( 'articles/*.md' )
        .pipe( $.marked( {
            gfm: true,
            highlight: function( code ) {
                return highlight.highlightAuto( code ).value;
            }
        } ) )
        .pipe( $.rename( {
            extname: '/index.html'
        } ) )
        .pipe( gulp.dest( 'build' ) );
} );

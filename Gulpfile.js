var gulp = require( 'gulp' ),
    highlight = require( 'highlight.js' ),
    $ = require( 'gulp-load-plugins' )();

gulp.task( 'convert', function() {
    gulp.src( 'articles/*.md' )
        .pipe( $.frontMatter( {
            property: 'data',
            remove: true
        } ) )
        .pipe( $.marked( { // convert the markdown
            gfm: true, // use github flavor markdown
            highlight: function( code ) { // highlight the code
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

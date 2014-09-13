/* jshint node: true */
"use strict";

var gulp = require( "gulp" ),
    highlight = require( "highlight.js" ),
    $ = require( "gulp-load-plugins" )();

gulp.task( "default", [ "dev" ] );

gulp.task( "dev", [ "build" ], function () {} );

gulp.task( "convert", function () {
    return gulp.src( "articles/*.md" )
        .pipe( $.frontMatter( {
            property: "data",
            remove: true
        } ) )
        .pipe( $.marked( { // convert the markdown
            gfm: true, // use github flavor markdown
            highlight: function ( code ) { // highlight the code
                return highlight.highlightAuto( code ).value;
            }
        } ) )
        .pipe( $.wrap( { // wrap it in a template
            src: "templates/article.html"
        }, {}, {
            interpolate: /\{\{([\s\S]+?)\}\}/g,
            evaluate: /\{\{\%(.+?)\%\}\}/g,
            escape: /\{\{-(.+?)\}\}/g
        } ) )
        .pipe( $.rename( { // create a file with nice urls
            extname: "/index.html"
        } ) )
        .pipe( gulp.dest( "build" ) );
} );

gulp.task( "watch", [ "fmt" ], function () {
    return gulp.watch( "*.js", [ "fmt" ] );
} );

function beautify() {
    return $.jsbeautifier( {
        html: {
            filetype: [ "html", "template" ],
            braceStyle: "collapse",
            indentChar: " ",
            indentScripts: "keep",
            indentSize: 4,
            maxPreserveNewlines: 10,
            preserveNewlines: true,
            unformatted: [ "a", "sub", "sup", "b", "i", "u" ],
            wrapLineLength: 0
        },
        css: {
            fileTypes: [ "css", "styl" ],
            indentChar: " ",
            indentSize: 4
        },
        js: {
            fileTypes: [ "js", "json" ],
            braceStyle: "collapse",
            breakChainedMethods: false,
            e4x: false,
            evalCode: false,
            indentChar: " ",
            indentLevel: 0,
            indentSize: 4,
            indentWithTabs: false,
            jslintHappy: true,
            keepArrayIndentation: false,
            keepFunctionIndentation: false,
            maxPreserveNewlines: 10,
            preserveNewlines: true,
            spaceBeforeConditional: true,
            spaceInParen: true,
            unescapeStrings: true,
            wrapLineLength: 0
        }
    } );
}

gulp.task( "beauty", function () {
    return gulp.src( [ "templates/**",
            "*.{html,json,js}", "build/**"
        ] )
        .pipe( beautify() )
        .pipe( gulp.dest( "." ) );
} );

gulp.task( "fmt2", function () {
    return gulp.src( "*.js" )
        .pipe( $.jsfmt.format() )
        .pipe( gulp.dest( "." ) );
} );

gulp.task( "lint", function () {
    return gulp.src( "*.js" )
        .pipe( $.jshint() )
        .pipe( $.jshint.reporter( "jshint-stylish" ) );
} );

gulp.task( "fmt", function () {
    return gulp.src( "*.js" )
        .pipe( $.esformatter( {
            "preset": "jquery",
            "plugins": [
                "esformatter-quotes",
                "esformatter-semicolons",
                "esformatter-braces"
            ],
            "quotes": {
                "type": "double",
                "avoidEscape": true
            },
            "indent": {
                "value": "    "
            },
            "whitespace": {
                "after": {

                }
            }
        } ) )
        .pipe( gulp.dest( "." ) );
} );

(function(exports) {
	"use strict";

	var fs = require( 'fs' );
	var path = require( 'path' );

	var RSVP = require( './rsvp' );
	var phantomJsPath = require('phantomjs').path;
	var phantomfile = path.join( __dirname, 'phantomscript.js' );
	var execFile = require('child_process').execFile;

	exports.convert = function( input, output, opts ){
		opts = opts || {};

		var files;
		if( typeof input === "string" && fs.existsSync( input ) && fs.lstatSync( input ).isDirectory()){
			files = fs.readdirSync( input ).map( function( file ){
				return path.join( input, file );
			});
		} else if( typeof input === "string" && fs.existsSync( input ) && fs.lstatSync( input ).isFile() ) {
			files = [ input ];
		} else if( Array.isArray( input ) ){
			files = input;
		} else {
			throw new Error( "Input must be Array of files or String that is a directory" );
		}

		if( !files.every( function( file ){
			return path.extname(file) === ".svg";
		})){
			throw new Error( "All files passed into svg-to-png must be SVG files, that includes all files in a directory" );
		}

		if( typeof output !== "string" ){
			throw new Error( "Output folder must be defined and a String" );
		}

		// take it to phantomjs to do the rest
		console.log( "svg-to-png now spawning phantomjs..." );
		console.log('(using path: ' + phantomJsPath + ')');

		return new RSVP.Promise(function(resolve, reject){
			execFile( phantomJsPath,
				[
					phantomfile,
					JSON.stringify(files),
					output
				],

				function(err, stdout, stderr){
					if( err ){
						console.log("\nSomething went wrong with phantomjs...");
						if( stderr ){
							console.log( stderr );
						}
						reject( err );
					} else {
						console.log( stdout );
						resolve( output );
					}
				});

			});


	};

}(typeof exports === 'object' && exports || this));

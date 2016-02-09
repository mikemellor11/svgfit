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
			throw new Error( "All files passed into svgfit must be SVG files, that includes all files in a directory" );
		}

		var filesDest;
		if( typeof output === "string" && path.extname(output) !== ".svg"){
			filesDest = files.map( function( file ){
				return path.join( output, path.basename(file) );
			});
		} else if( typeof output === "string" && path.extname(output) === ".svg" && files.length === 1 ) {
			filesDest = [ output ];
		} else if( typeof output === "string" && files.length > 1 ) {
			throw new Error( "Multiple inputs but only a single output file specified, must be array and must have same length" );
		} else if( Array.isArray( output ) && output.length !== files.length ) {
			throw new Error( "Input array must be the same length as the output array" );
		} else if( Array.isArray( output ) ){
			filesDest = output;
		} else {
			throw new Error( "Destination must be Array of files or String that is a directory" );
		}

		if( !filesDest.every( function( file ){
			return path.extname(file) === ".svg";
		})){
			throw new Error( "All destinations passed into svgfit must have an svg extension" );
		}

		// take it to phantomjs to do the rest
		console.log( "svgfit now spawning phantomjs..." );
		console.log('(using path: ' + phantomJsPath + ')');

		return new RSVP.Promise(function(resolve, reject){
			execFile( phantomJsPath,
				[
					phantomfile,
					JSON.stringify(files),
					JSON.stringify(filesDest)
				],

				function(err, stdout, stderr){
					if( err ){
						console.log("\nSomething went wrong with phantomjs...");
						if( stderr ){
							console.log( stderr );
						}
						reject( err );
					} else {
						resolve( filesDest );
					}
				});

			});


	};

}(typeof exports === 'object' && exports || this));

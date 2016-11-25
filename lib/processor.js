(function(exports) {
	"use strict";
	var fs = require( 'fs' );

	var RSVP = require('./rsvp');
	var ProcessingFile = require( "./processing-file" );

	exports.render = function( gFile , dest, o) {

		var page = require( "webpage" ).create();

		var filename = gFile.pathdir + fs.separator + gFile.filename;

		return new RSVP.Promise(function(resolve, reject){
			page.open( gFile.uri, function( status ){
				if( status === "success" ){
					var newSVG = page.evaluateJavaScript('function(){ \
						var svg = document.querySelector("svg"); \
						var bbox  = svg.getBBox(); \
						svg.setAttribute("width", bbox.width); \
						svg.setAttribute("height", bbox.height); \
						svg.setAttribute("viewBox", bbox.x + " " + bbox.y + " " + bbox.width + " " + bbox.height); \
						return; \
					}');
					fs.write(dest, page.content);
					resolve();
				} else {
					reject( status + ": " + "Phantom had an error opening - " + gFile.uri + " - " + "Does it exist? " + fs.exists(gFile.uri));
				}
			});
		});
	};

	// process an svg file from the source directory
	exports.processFile = function( filename, dest, o ){
		var self = this;

		return new RSVP.Promise(function( resolve, reject ){
			var pFile;

			try {
				pFile = new ProcessingFile( filename );
				pFile.setImageData();
			} catch( e ){
				reject( e );
			}

			self.render( pFile , dest, o )
			.then( function(){
				resolve();
			})
			.catch( function(err){
				reject(err);
			});
		});

	}; // end of processFile
}(typeof exports === 'object' && exports || this));


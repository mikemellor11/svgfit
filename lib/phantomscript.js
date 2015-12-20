(function(){
	"use strict";

	var system = require("system");
	var fs = require( "fs" );

	phantom.onError = function(msg, trace) {
		var msgStack = ['PHANTOM ERROR: ' + msg];
		if (trace && trace.length) {
			msgStack.push('TRACE:');
			trace.forEach(function(t) {
				msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
			});
		}
		system.stderr.write( msgStack.join('\n') );
		phantom.exit(1);
	};

	var RSVP = require('./rsvp');
	var processor = require('./processor');

	RSVP.on('error', function(reason) {
		throw new Error( reason );
	});

	var options = {
		inputFiles: JSON.parse(phantom.args[0]),
		dest: phantom.args[1]
	};

	if( !options.dest.match( fs.separator + '$' ) ){
		options.dest += fs.separator;
	}


	var promises = options.inputFiles.map( function( file ){
		return processor.processFile( file, options );
	});


	RSVP.all( promises )
	.then( function(){
		phantom.exit();
	})
	.catch(function(err){
		throw new Error( err );
	});
})();

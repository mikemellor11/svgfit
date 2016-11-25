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
		inputFiles: JSON.parse(system.args[1]),
		destFiles: JSON.parse(system.args[2]),
	};

	var promises = options.inputFiles.map( function( file, i ){
		return processor.processFile( file, options.destFiles[i], options );
	});


	RSVP.all( promises )
	.then( function(){
		phantom.exit();
	})
	.catch(function(err){
		throw new Error( err );
	});
})();

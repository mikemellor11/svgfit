var svg = require('./../lib/svgfit');
var path = require( 'path' );

svg.convert(path.join( "svg", "search.svg" ), 'tmp');
svg.convert([path.join( "svg", "search.svg" ), path.join( "svg", "search2.svg" )], 'tmp');
svg.convert(path.join( "svg", "search.svg" ), path.join( "tmp", "search.svg" ));
svg.convert([path.join( "svg", "search.svg" ), path.join( "svg", "search2.svg" )], [path.join( "tmp", "search.svg" ), path.join( "tmp", "search2.svg" )]);
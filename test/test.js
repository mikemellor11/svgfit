var assert = require('assert');
var svg = require('..');
var fs = require('fs');
var expected = fs.readFileSync('test/expected/search.svg', 'utf-8');

describe('svgfit', function() {
	beforeEach(function(){
		fs.access('test/actual/search.svg', fs.F_OK, function(err) {if (!err) {fs.unlinkSync('test/actual/search.svg');}});
		fs.access('test/actual/search2.svg', fs.F_OK, function(err) {if (!err) {fs.unlinkSync('test/actual/search2.svg');}});
		fs.access('test/actual/search3.svg', fs.F_OK, function(err) {if (!err) {fs.unlinkSync('test/actual/search3.svg');}});
	});

	it('should render svg to its exact bounds', function(done) {
		svg.fit('svg/search.svg', 'test/actual', {silent: true}).then(function(){
			assert.equal(
				fs.readFileSync('test/actual/search.svg', 'utf-8'), 
				expected
			);
			done();
		});
	});

	it('should render svg to its exact bounds and export to specified location', function(done) {
		svg.fit('svg/search.svg', 'test/actual/search3.svg', {silent: true}).then(function(){
			assert.equal(
				fs.readFileSync('test/actual/search3.svg', 'utf-8'), 
				expected
			);
			done();
		});
	});

	it('should be able to point to folder of svgs', function(done) {
		svg.fit('svg', 'test/actual', {silent: true}).then(function(){
			assert.equal(
				fs.readFileSync('test/actual/search.svg', 'utf-8'), 
				expected
			);

			assert.equal(
				fs.readFileSync('test/actual/search2.svg', 'utf-8'), 
				expected
			);
			done();
		});
	});

	it('should be able to handle an array of svgs', function(done) {
		svg.fit(['svg/search.svg', 'svg/search2.svg'], 'test/actual', {silent: true}).then(function(){
			assert.equal(
				fs.readFileSync('test/actual/search.svg', 'utf-8'), 
				expected
			);

			assert.equal(
				fs.readFileSync('test/actual/search2.svg', 'utf-8'), 
				expected
			);
			done();
		});
	});

	it('should be able to handle an array of svgs and an array of outputs', function(done) {
		svg.fit(['svg/search.svg', 'svg/search2.svg'], ['test/actual/search.svg', 'test/actual/search3.svg'], {silent: true}).then(function(){
			assert.equal(
				fs.readFileSync('test/actual/search.svg', 'utf-8'), 
				expected
			);

			assert.equal(
				fs.readFileSync('test/actual/search3.svg', 'utf-8'), 
				expected
			);
			done();
		});
	});

	it('should throw error if anything other than an array or string passed to input', function() {
		assert.throws(function(){ svg.fit(10, 'test/actual', {silent: true}) }, Error);
	});

	it('should throw error if anything other than an array or string passed to output', function() {
		assert.throws(function(){ svg.fit('lib', 10, {silent: true}) }, Error);
	});

	it('should throw error if a folder specified and not all files are svgs', function() {
		assert.throws(function(){ svg.fit('lib', 'test/actual', {silent: true}) }, Error);
	});

	it('should throw error if a file is specified and is not an svg', function() {
		assert.throws(function(){ svg.fit('package.json', 'test/actual', {silent: true}) }, Error);
	});

	it('should throw error if outputs count is longer than inputs', function() {
		assert.throws(function(){ svg.fit(['svg/search.svg', 'svg/search2.svg'], ['svg/search.svg', 'svg/search2.svg', 'svg/search3.svg'], {silent: true}) }, Error);
	});

	it('should throw error if outputs count is less than inputs', function() {
		assert.throws(function(){ svg.fit(['svg/search.svg', 'svg/search2.svg'], ['svg/search.svg'], {silent: true}) }, Error);
	});

	it('should throw error if outputs has a file extension that is not svg', function() {
		assert.throws(function(){ svg.fit(['svg/search.svg', 'svg/search2.svg'], ['svg/search.svg', 'svg/search2.txt'], {silent: true}) }, Error);
	});
});
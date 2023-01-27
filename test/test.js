import assert from 'assert';
import svg from '../index.js';
import fs from 'fs-extra';

describe('svgfit', function() {
	var expected;

	beforeEach(function(){
		expected = {
			circle: fs.readFileSync('test/expected/circle.svg', 'utf-8'),
			search: fs.readFileSync('test/expected/search.svg', 'utf-8')
		};

		fs.rmSync('test/actual', {recursive: true, force: true});
	});

	it('should render svg to its exact bounds', async function() {
		await svg.fit('svg/search.svg', 'test/actual', {silent: true});

		assert.equal(fs.readFileSync('test/actual/search.svg', 'utf-8'), expected.search);
	});

	it('should render svg to its exact bounds without width and height if not set on original svg', async function() {
		await svg.fit('svg/circle.svg', 'test/actual', {silent: true});

		assert.equal(fs.readFileSync('test/actual/circle.svg', 'utf-8'), expected.circle);
	});

	it('should render svg to its exact bounds and export to specified location', async function() {
		await svg.fit('svg/search.svg', 'test/actual/search3.svg', {silent: true});

		assert.equal(fs.readFileSync('test/actual/search3.svg', 'utf-8'), expected.search);
	});

	it('should be able to point to folder of svgs', async function() {
		await svg.fit('svg', 'test/actual', {silent: true});

		assert.equal(fs.readFileSync('test/actual/search.svg', 'utf-8'), expected.search);
		assert.equal(fs.readFileSync('test/actual/circle.svg', 'utf-8'), expected.circle);
	});

	it('should be able to handle an array of svgs', async function() {
		await svg.fit(['svg/search.svg', 'svg/circle.svg'], 'test/actual', {silent: true});

		assert.equal(fs.readFileSync('test/actual/search.svg', 'utf-8'), expected.search);
		assert.equal(fs.readFileSync('test/actual/circle.svg', 'utf-8'), expected.circle);
	});

	it('should be able to handle an array of svgs and an array of outputs', async function() {
		await svg.fit(['svg/search.svg', 'svg/circle.svg'], ['test/actual/search.svg', 'test/actual/search3.svg'], {silent: true});

		assert.equal(fs.readFileSync('test/actual/search.svg', 'utf-8'), expected.search);
		assert.equal(fs.readFileSync('test/actual/search3.svg', 'utf-8'), expected.circle);
	});

	// it('should throw error if anything other than an array or string passed to input', function() {
	// 	assert.throws(function(){ svg.fit(10, 'test/actual') }, Error);
	// });

	// it('should throw error if anything other than an array or string passed to output', function() {
	// 	assert.throws(function(){ svg.fit('lib', 10) }, Error);
	// });

	// it('should throw error if a folder specified and not all files are svgs', function() {
	// 	assert.throws(function(){ svg.fit('lib', 'test/actual') }, Error);
	// });

	// it('should throw error if a file is specified and is not an svg', function() {
	// 	assert.throws(function(){ svg.fit('package.json', 'test/actual') }, Error);
	// });

	// it('should throw error if outputs count is longer than inputs', function() {
	// 	assert.throws(function(){ svg.fit(['svg/search.svg', 'svg/search2.svg'], ['svg/search.svg', 'svg/search2.svg', 'svg/search3.svg']) }, Error);
	// });

	// it('should throw error if outputs count is less than inputs', function() {
	// 	assert.throws(function(){ svg.fit(['svg/search.svg', 'svg/search2.svg'], ['svg/search.svg']) }, Error);
	// });

	// it('should throw error if outputs has a file extension that is not svg', function() {
	// 	assert.throws(function(){ svg.fit(['svg/search.svg', 'svg/search2.svg'], ['svg/search.svg', 'svg/search2.txt']) }, Error);
	// });
});
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

	it('should throw error if anything other than an array or string passed to input', async function() {
		await svg.fit(10, 'test/actual').then(() => assert.fail("wasn't supposed to succeed"), (e) => assert.equal(e.message, "src must be an array or a string."))
	});

	it('should throw error if anything other than an array or string passed to output', async function() {
		await svg.fit('lib', 10).then(() => assert.fail("wasn't supposed to succeed"), (e) => assert.equal(e.message, "dest must be an array or a string."))
	});

	it('should throw error if a folder specified and not all files are svgs', async function() {
		await svg.fit('test', 'test/actual').then(() => assert.fail("wasn't supposed to succeed"), (e) => assert.equal(e.message, "some srcs are non svg files."))
	});

	it('should throw error if a file is specified and is not an svg', async function() {
		await svg.fit('package.json', 'test/actual').then(() => assert.fail("wasn't supposed to succeed"), (e) => assert.equal(e.message, "some srcs are non svg files."))
	});

	it('should throw error if outputs count is longer than inputs', async function() {
		await svg.fit(['svg/search.svg', 'svg/circle.svg'], ['svg/search.svg', 'svg/search2.svg', 'svg/search3.svg']).then(() => assert.fail("wasn't supposed to succeed"), (e) => assert.equal(e.message, "uneven number of src and dest files."))
	});

	it('should throw error if outputs count is less than inputs', async function() {
		await svg.fit(['svg/search.svg', 'svg/circle.svg'], ['svg/search.svg']).then(() => assert.fail("wasn't supposed to succeed"), (e) => assert.equal(e.message, "uneven number of src and dest files."))
	});

	it('should throw error if outputs has a file extension that is not svg', async function() {
		await svg.fit(['svg/search.svg', 'svg/circle.svg'], ['svg/search.svg', 'svg/circle.txt']).then(() => assert.fail("wasn't supposed to succeed"), (e) => assert.equal(e.message, "some dest files have a non svg extension."))
	});

	// Test a file & a folder src
	// Test a file & a folder dest
	// Test a missing folder
	// Test a missing file
	// Test nested svgs
});
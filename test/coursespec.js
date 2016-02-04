var app = require('./helpers/app');

var should = require('should'),
	supertest = require('supertest');

describe('flights', function () {

	it('should return valid flight data for flight 18',
	function (done) {

		supertest(app)
		.get('/api/getAllYouTubeVideos')
		.expect(200)
		.end(function (err, res) {
			res.status.should.equal(200);
			done();
		});

	});

	it('should return an error for an invalid flight',
	function (done) {

		supertest(app)
		.get('/api/getAllYouTubeVideos')
		.expect(404)
		.end(function (err, res) {
			res.status.should.equal(404);
			done();
		});

	});
	it('should mark a flight as arrived',
	function (done) {
		supertest(app)
		.put('/api/getAllTraining')
		.expect(200)
		.end(function  (err, res) {
			res.status.should.equal(200);
			res.body.status.should.equal('done');

			supertest(app)
			.get('/api/getAllTraining')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				res.body.actualArrive
				.should.not.equal(undefined);

				done();
			})
		});
	});
});

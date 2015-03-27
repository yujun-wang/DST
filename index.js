/**
* Main PipeLine server library
*/

var _ = require('lodash');

var async = require('async-chainable');

var deepDiff = require('deep-diff');
var events = require('events');

var request = require('superagent/lib/node');

var util = require('util');

function StemServer() {
	/**
	* Setup the main cron cycle
	*/
	this.cron = function() {
		var self = this;
		var cronCycle = function() {
			self.emit('cronCycle');
			self.projectsExecute(function() {
				setTimeout(cronCycle, config.cron.execute.interval);
			});
		};
		setTimeout(cronCycle, config.cron.execute.intervalStart);
	};

util.inherits(PipeLineServer, events.EventEmitter);

module.exports = function() {
	return new StemServer();
};

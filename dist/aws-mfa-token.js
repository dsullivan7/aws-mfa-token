#!/usr/bin/env node
'use strict';

var _yargs = require('yargs');

var _lib = require('../lib');

var _lib2 = _interopRequireDefault(_lib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var token = _yargs.argv.token;
var profile = _yargs.argv.token;
var serialNumber = _yargs.argv['serial-number'];

function usage() {
  console.log('\nUsage:\n\n  aws-mfa-token --token <token>\n\nWill add the mfa token to ~/.aws/config\n');
}

if (token) {
  _lib2.default.updateToken(token, profile, serialNumber);
} else {
  usage();
}
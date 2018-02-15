'use strict';

var _child_process = require('child_process');

var beginToken = '# mfa-begin';
var endToken = '# mfa-end';

var execPromise = function execPromise(command) {
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)(command, function (err, stdout, stderr) {
      if (err) {
        return reject(err);
      } else if (stderr) {
        return reject(stderr);
      }
      return resolve(stdout);
    });
  });
};

var awsCommandExec = function awsCommandExec(token, profile, serialNumber) {
  return execPromise('aws sts get-session-token       --duration-seconds 129600       --serial-number ' + serialNumber + '       --profile ' + profile + '       --token ' + token);
};

var updateToken = function updateToken(token, profile, serialNumber, region, mfaProfile) {
  return awsCommandExec(token, profile, serialNumber).then(function (response) {
    return JSON.parse(response);
  }).then(function (json) {
    var secretAccessKey = json.Credentials.SecretAccessKey;
    var sessionToken = json.Credentials.SessionToken;
    var accessKeyId = json.Credentials.AccessKeyId;

    var newProfile = beginToken + '\n[profile ' + mfaProfile + ']\noutput = json\naws_access_key_id = ' + accessKeyId + '\naws_secret_access_key = ' + secretAccessKey + '\naws_session_token = ' + sessionToken + '\n' + endToken;
    return execPromise('sed -i \'\' \'/' + beginToken + '/,/' + endToken + '/d\' ~/.aws/config').then(function () {
      return execPromise('echo \'' + newProfile + '\' >> ~/.aws/config');
    });
  });
};

module.exports = {
  updateToken: updateToken
};
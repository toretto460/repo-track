var githubApi = require('github');

exports.api = new githubApi({
    // required
    version: "3.0.0",
    // optional
    timeout: 5000
});

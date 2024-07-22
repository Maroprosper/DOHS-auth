const owasp = require('owasp-password-strength-test');

owasp.config({
  minLength: 8,
  minOptionalTestsToPass: 4,
});

module.exports = owasp;

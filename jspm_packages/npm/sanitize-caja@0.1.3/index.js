/* */ 
var html_sanitize = require('./sanitizer-bundle');
module.exports = function(_) {
  if (!_)
    return '';
  return html_sanitize(_, cleanUrl, cleanId);
};
function cleanUrl(url) {
  'use strict';
  if (/^https?/.test(url.getScheme()))
    return url.toString();
  if (/^mailto?/.test(url.getScheme()))
    return url.toString();
  if ('data' == url.getScheme() && /^image/.test(url.getPath())) {
    return url.toString();
  }
}
function cleanId(id) {
  return id;
}

/* */ 
'use strict';
var format_url = require('./format_url'),
    util = require('./util'),
    sanitize = require('sanitize-caja');
function icon(fp, options) {
  fp = fp || {};
  var sizes = {
    small: [20, 50],
    medium: [30, 70],
    large: [35, 90]
  },
      size = fp['marker-size'] || 'medium',
      symbol = ('marker-symbol' in fp && fp['marker-symbol'] !== '') ? '-' + fp['marker-symbol'] : '',
      color = (fp['marker-color'] || '7e7e7e').replace('#', '');
  return L.icon({
    iconUrl: format_url('/v4/marker/' + 'pin-' + size.charAt(0) + symbol + '+' + color + (L.Browser.retina ? '@2x' : '') + '.png', options && options.accessToken),
    iconSize: sizes[size],
    iconAnchor: [sizes[size][0] / 2, sizes[size][1] / 2],
    popupAnchor: [0, -sizes[size][1] / 2]
  });
}
function style(f, latlon, options) {
  return L.marker(latlon, {
    icon: icon(f.properties, options),
    title: util.strip_tags(sanitize((f.properties && f.properties.title) || ''))
  });
}
function createPopup(f, sanitizer) {
  if (!f || !f.properties)
    return '';
  var popup = '';
  if (f.properties.title) {
    popup += '<div class="marker-title">' + f.properties.title + '</div>';
  }
  if (f.properties.description) {
    popup += '<div class="marker-description">' + f.properties.description + '</div>';
  }
  return (sanitizer || sanitize)(popup);
}
module.exports = {
  icon: icon,
  style: style,
  createPopup: createPopup
};

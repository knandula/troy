/* */ 
(function(process) {
  var URI = (function() {
    function parse(uriStr) {
      var m = ('' + uriStr).match(URI_RE_);
      if (!m) {
        return null;
      }
      return new URI(nullIfAbsent(m[1]), nullIfAbsent(m[2]), nullIfAbsent(m[3]), nullIfAbsent(m[4]), nullIfAbsent(m[5]), nullIfAbsent(m[6]), nullIfAbsent(m[7]));
    }
    function create(scheme, credentials, domain, port, path, query, fragment) {
      var uri = new URI(encodeIfExists2(scheme, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_), encodeIfExists2(credentials, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_), encodeIfExists(domain), port > 0 ? port.toString() : null, encodeIfExists2(path, URI_DISALLOWED_IN_PATH_), null, encodeIfExists(fragment));
      if (query) {
        if ('string' === typeof query) {
          uri.setRawQuery(query.replace(/[^?&=0-9A-Za-z_\-~.%]/g, encodeOne));
        } else {
          uri.setAllParameters(query);
        }
      }
      return uri;
    }
    function encodeIfExists(unescapedPart) {
      if ('string' == typeof unescapedPart) {
        return encodeURIComponent(unescapedPart);
      }
      return null;
    }
    ;
    function encodeIfExists2(unescapedPart, extra) {
      if ('string' == typeof unescapedPart) {
        return encodeURI(unescapedPart).replace(extra, encodeOne);
      }
      return null;
    }
    ;
    function encodeOne(ch) {
      var n = ch.charCodeAt(0);
      return '%' + '0123456789ABCDEF'.charAt((n >> 4) & 0xf) + '0123456789ABCDEF'.charAt(n & 0xf);
    }
    function normPath(path) {
      return path.replace(/(^|\/)\.(?:\/|$)/g, '$1').replace(/\/{2,}/g, '/');
    }
    var PARENT_DIRECTORY_HANDLER = new RegExp('' + '(/|^)' + '(?:[^./][^/]*|\\.{2,}(?:[^./][^/]*)|\\.{3,}[^/]*)' + '/\\.\\.(?:/|$)');
    var PARENT_DIRECTORY_HANDLER_RE = new RegExp(PARENT_DIRECTORY_HANDLER);
    var EXTRA_PARENT_PATHS_RE = /^(?:\.\.\/)*(?:\.\.$)?/;
    function collapse_dots(path) {
      if (path === null) {
        return null;
      }
      var p = normPath(path);
      var r = PARENT_DIRECTORY_HANDLER_RE;
      for (var q; (q = p.replace(r, '$1')) != p; p = q) {}
      ;
      return p;
    }
    function resolve(baseUri, relativeUri) {
      var absoluteUri = baseUri.clone();
      var overridden = relativeUri.hasScheme();
      if (overridden) {
        absoluteUri.setRawScheme(relativeUri.getRawScheme());
      } else {
        overridden = relativeUri.hasCredentials();
      }
      if (overridden) {
        absoluteUri.setRawCredentials(relativeUri.getRawCredentials());
      } else {
        overridden = relativeUri.hasDomain();
      }
      if (overridden) {
        absoluteUri.setRawDomain(relativeUri.getRawDomain());
      } else {
        overridden = relativeUri.hasPort();
      }
      var rawPath = relativeUri.getRawPath();
      var simplifiedPath = collapse_dots(rawPath);
      if (overridden) {
        absoluteUri.setPort(relativeUri.getPort());
        simplifiedPath = simplifiedPath && simplifiedPath.replace(EXTRA_PARENT_PATHS_RE, '');
      } else {
        overridden = !!rawPath;
        if (overridden) {
          if (simplifiedPath.charCodeAt(0) !== 0x2f) {
            var absRawPath = collapse_dots(absoluteUri.getRawPath() || '').replace(EXTRA_PARENT_PATHS_RE, '');
            var slash = absRawPath.lastIndexOf('/') + 1;
            simplifiedPath = collapse_dots((slash ? absRawPath.substring(0, slash) : '') + collapse_dots(rawPath)).replace(EXTRA_PARENT_PATHS_RE, '');
          }
        } else {
          simplifiedPath = simplifiedPath && simplifiedPath.replace(EXTRA_PARENT_PATHS_RE, '');
          if (simplifiedPath !== rawPath) {
            absoluteUri.setRawPath(simplifiedPath);
          }
        }
      }
      if (overridden) {
        absoluteUri.setRawPath(simplifiedPath);
      } else {
        overridden = relativeUri.hasQuery();
      }
      if (overridden) {
        absoluteUri.setRawQuery(relativeUri.getRawQuery());
      } else {
        overridden = relativeUri.hasFragment();
      }
      if (overridden) {
        absoluteUri.setRawFragment(relativeUri.getRawFragment());
      }
      return absoluteUri;
    }
    function URI(rawScheme, rawCredentials, rawDomain, port, rawPath, rawQuery, rawFragment) {
      this.scheme_ = rawScheme;
      this.credentials_ = rawCredentials;
      this.domain_ = rawDomain;
      this.port_ = port;
      this.path_ = rawPath;
      this.query_ = rawQuery;
      this.fragment_ = rawFragment;
      this.paramCache_ = null;
    }
    URI.prototype.toString = function() {
      var out = [];
      if (null !== this.scheme_) {
        out.push(this.scheme_, ':');
      }
      if (null !== this.domain_) {
        out.push('//');
        if (null !== this.credentials_) {
          out.push(this.credentials_, '@');
        }
        out.push(this.domain_);
        if (null !== this.port_) {
          out.push(':', this.port_.toString());
        }
      }
      if (null !== this.path_) {
        out.push(this.path_);
      }
      if (null !== this.query_) {
        out.push('?', this.query_);
      }
      if (null !== this.fragment_) {
        out.push('#', this.fragment_);
      }
      return out.join('');
    };
    URI.prototype.clone = function() {
      return new URI(this.scheme_, this.credentials_, this.domain_, this.port_, this.path_, this.query_, this.fragment_);
    };
    URI.prototype.getScheme = function() {
      return this.scheme_ && decodeURIComponent(this.scheme_).toLowerCase();
    };
    URI.prototype.getRawScheme = function() {
      return this.scheme_;
    };
    URI.prototype.setScheme = function(newScheme) {
      this.scheme_ = encodeIfExists2(newScheme, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_);
      return this;
    };
    URI.prototype.setRawScheme = function(newScheme) {
      this.scheme_ = newScheme ? newScheme : null;
      return this;
    };
    URI.prototype.hasScheme = function() {
      return null !== this.scheme_;
    };
    URI.prototype.getCredentials = function() {
      return this.credentials_ && decodeURIComponent(this.credentials_);
    };
    URI.prototype.getRawCredentials = function() {
      return this.credentials_;
    };
    URI.prototype.setCredentials = function(newCredentials) {
      this.credentials_ = encodeIfExists2(newCredentials, URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_);
      return this;
    };
    URI.prototype.setRawCredentials = function(newCredentials) {
      this.credentials_ = newCredentials ? newCredentials : null;
      return this;
    };
    URI.prototype.hasCredentials = function() {
      return null !== this.credentials_;
    };
    URI.prototype.getDomain = function() {
      return this.domain_ && decodeURIComponent(this.domain_);
    };
    URI.prototype.getRawDomain = function() {
      return this.domain_;
    };
    URI.prototype.setDomain = function(newDomain) {
      return this.setRawDomain(newDomain && encodeURIComponent(newDomain));
    };
    URI.prototype.setRawDomain = function(newDomain) {
      this.domain_ = newDomain ? newDomain : null;
      return this.setRawPath(this.path_);
    };
    URI.prototype.hasDomain = function() {
      return null !== this.domain_;
    };
    URI.prototype.getPort = function() {
      return this.port_ && decodeURIComponent(this.port_);
    };
    URI.prototype.setPort = function(newPort) {
      if (newPort) {
        newPort = Number(newPort);
        if (newPort !== (newPort & 0xffff)) {
          throw new Error('Bad port number ' + newPort);
        }
        this.port_ = '' + newPort;
      } else {
        this.port_ = null;
      }
      return this;
    };
    URI.prototype.hasPort = function() {
      return null !== this.port_;
    };
    URI.prototype.getPath = function() {
      return this.path_ && decodeURIComponent(this.path_);
    };
    URI.prototype.getRawPath = function() {
      return this.path_;
    };
    URI.prototype.setPath = function(newPath) {
      return this.setRawPath(encodeIfExists2(newPath, URI_DISALLOWED_IN_PATH_));
    };
    URI.prototype.setRawPath = function(newPath) {
      if (newPath) {
        newPath = String(newPath);
        this.path_ = (!this.domain_ || /^\//.test(newPath)) ? newPath : '/' + newPath;
      } else {
        this.path_ = null;
      }
      return this;
    };
    URI.prototype.hasPath = function() {
      return null !== this.path_;
    };
    URI.prototype.getQuery = function() {
      return this.query_ && decodeURIComponent(this.query_).replace(/\+/g, ' ');
    };
    URI.prototype.getRawQuery = function() {
      return this.query_;
    };
    URI.prototype.setQuery = function(newQuery) {
      this.paramCache_ = null;
      this.query_ = encodeIfExists(newQuery);
      return this;
    };
    URI.prototype.setRawQuery = function(newQuery) {
      this.paramCache_ = null;
      this.query_ = newQuery ? newQuery : null;
      return this;
    };
    URI.prototype.hasQuery = function() {
      return null !== this.query_;
    };
    URI.prototype.setAllParameters = function(params) {
      if (typeof params === 'object') {
        if (!(params instanceof Array) && (params instanceof Object || Object.prototype.toString.call(params) !== '[object Array]')) {
          var newParams = [];
          var i = -1;
          for (var k in params) {
            var v = params[k];
            if ('string' === typeof v) {
              newParams[++i] = k;
              newParams[++i] = v;
            }
          }
          params = newParams;
        }
      }
      this.paramCache_ = null;
      var queryBuf = [];
      var separator = '';
      for (var j = 0; j < params.length; ) {
        var k = params[j++];
        var v = params[j++];
        queryBuf.push(separator, encodeURIComponent(k.toString()));
        separator = '&';
        if (v) {
          queryBuf.push('=', encodeURIComponent(v.toString()));
        }
      }
      this.query_ = queryBuf.join('');
      return this;
    };
    URI.prototype.checkParameterCache_ = function() {
      if (!this.paramCache_) {
        var q = this.query_;
        if (!q) {
          this.paramCache_ = [];
        } else {
          var cgiParams = q.split(/[&\?]/);
          var out = [];
          var k = -1;
          for (var i = 0; i < cgiParams.length; ++i) {
            var m = cgiParams[i].match(/^([^=]*)(?:=(.*))?$/);
            out[++k] = decodeURIComponent(m[1]).replace(/\+/g, ' ');
            out[++k] = decodeURIComponent(m[2] || '').replace(/\+/g, ' ');
          }
          this.paramCache_ = out;
        }
      }
    };
    URI.prototype.setParameterValues = function(key, values) {
      if (typeof values === 'string') {
        values = [values];
      }
      this.checkParameterCache_();
      var newValueIndex = 0;
      var pc = this.paramCache_;
      var params = [];
      for (var i = 0,
          k = 0; i < pc.length; i += 2) {
        if (key === pc[i]) {
          if (newValueIndex < values.length) {
            params.push(key, values[newValueIndex++]);
          }
        } else {
          params.push(pc[i], pc[i + 1]);
        }
      }
      while (newValueIndex < values.length) {
        params.push(key, values[newValueIndex++]);
      }
      this.setAllParameters(params);
      return this;
    };
    URI.prototype.removeParameter = function(key) {
      return this.setParameterValues(key, []);
    };
    URI.prototype.getAllParameters = function() {
      this.checkParameterCache_();
      return this.paramCache_.slice(0, this.paramCache_.length);
    };
    URI.prototype.getParameterValues = function(paramNameUnescaped) {
      this.checkParameterCache_();
      var values = [];
      for (var i = 0; i < this.paramCache_.length; i += 2) {
        if (paramNameUnescaped === this.paramCache_[i]) {
          values.push(this.paramCache_[i + 1]);
        }
      }
      return values;
    };
    URI.prototype.getParameterMap = function(paramNameUnescaped) {
      this.checkParameterCache_();
      var paramMap = {};
      for (var i = 0; i < this.paramCache_.length; i += 2) {
        var key = this.paramCache_[i++],
            value = this.paramCache_[i++];
        if (!(key in paramMap)) {
          paramMap[key] = [value];
        } else {
          paramMap[key].push(value);
        }
      }
      return paramMap;
    };
    URI.prototype.getParameterValue = function(paramNameUnescaped) {
      this.checkParameterCache_();
      for (var i = 0; i < this.paramCache_.length; i += 2) {
        if (paramNameUnescaped === this.paramCache_[i]) {
          return this.paramCache_[i + 1];
        }
      }
      return null;
    };
    URI.prototype.getFragment = function() {
      return this.fragment_ && decodeURIComponent(this.fragment_);
    };
    URI.prototype.getRawFragment = function() {
      return this.fragment_;
    };
    URI.prototype.setFragment = function(newFragment) {
      this.fragment_ = newFragment ? encodeURIComponent(newFragment) : null;
      return this;
    };
    URI.prototype.setRawFragment = function(newFragment) {
      this.fragment_ = newFragment ? newFragment : null;
      return this;
    };
    URI.prototype.hasFragment = function() {
      return null !== this.fragment_;
    };
    function nullIfAbsent(matchPart) {
      return ('string' == typeof matchPart) && (matchPart.length > 0) ? matchPart : null;
    }
    var URI_RE_ = new RegExp("^" + "(?:" + "([^:/?#]+)" + ":)?" + "(?://" + "(?:([^/?#]*)@)?" + "([^/?#:@]*)" + "(?::([0-9]+))?" + ")?" + "([^?#]+)?" + "(?:\\?([^#]*))?" + "(?:#(.*))?" + "$");
    var URI_DISALLOWED_IN_SCHEME_OR_CREDENTIALS_ = /[#\/\?@]/g;
    var URI_DISALLOWED_IN_PATH_ = /[\#\?]/g;
    URI.parse = parse;
    URI.create = create;
    URI.resolve = resolve;
    URI.collapse_dots = collapse_dots;
    URI.utils = {
      mimeTypeOf: function(uri) {
        var uriObj = parse(uri);
        if (/\.html$/.test(uriObj.getPath())) {
          return 'text/html';
        } else {
          return 'application/javascript';
        }
      },
      resolve: function(base, uri) {
        if (base) {
          return resolve(parse(base), parse(uri)).toString();
        } else {
          return '' + uri;
        }
      }
    };
    return URI;
  })();
  var html4 = {};
  html4.atype = {
    'NONE': 0,
    'URI': 1,
    'URI_FRAGMENT': 11,
    'SCRIPT': 2,
    'STYLE': 3,
    'HTML': 12,
    'ID': 4,
    'IDREF': 5,
    'IDREFS': 6,
    'GLOBAL_NAME': 7,
    'LOCAL_NAME': 8,
    'CLASSES': 9,
    'FRAME_TARGET': 10,
    'MEDIA_QUERY': 13
  };
  html4['atype'] = html4.atype;
  html4.ATTRIBS = {
    '*::class': 9,
    '*::dir': 0,
    '*::draggable': 0,
    '*::hidden': 0,
    '*::id': 4,
    '*::inert': 0,
    '*::itemprop': 0,
    '*::itemref': 6,
    '*::itemscope': 0,
    '*::lang': 0,
    '*::onblur': 2,
    '*::onchange': 2,
    '*::onclick': 2,
    '*::ondblclick': 2,
    '*::onfocus': 2,
    '*::onkeydown': 2,
    '*::onkeypress': 2,
    '*::onkeyup': 2,
    '*::onload': 2,
    '*::onmousedown': 2,
    '*::onmousemove': 2,
    '*::onmouseout': 2,
    '*::onmouseover': 2,
    '*::onmouseup': 2,
    '*::onreset': 2,
    '*::onscroll': 2,
    '*::onselect': 2,
    '*::onsubmit': 2,
    '*::onunload': 2,
    '*::spellcheck': 0,
    '*::style': 3,
    '*::title': 0,
    '*::translate': 0,
    'a::accesskey': 0,
    'a::coords': 0,
    'a::href': 1,
    'a::hreflang': 0,
    'a::name': 7,
    'a::onblur': 2,
    'a::onfocus': 2,
    'a::shape': 0,
    'a::tabindex': 0,
    'a::target': 10,
    'a::type': 0,
    'area::accesskey': 0,
    'area::alt': 0,
    'area::coords': 0,
    'area::href': 1,
    'area::nohref': 0,
    'area::onblur': 2,
    'area::onfocus': 2,
    'area::shape': 0,
    'area::tabindex': 0,
    'area::target': 10,
    'audio::controls': 0,
    'audio::loop': 0,
    'audio::mediagroup': 5,
    'audio::muted': 0,
    'audio::preload': 0,
    'bdo::dir': 0,
    'blockquote::cite': 1,
    'br::clear': 0,
    'button::accesskey': 0,
    'button::disabled': 0,
    'button::name': 8,
    'button::onblur': 2,
    'button::onfocus': 2,
    'button::tabindex': 0,
    'button::type': 0,
    'button::value': 0,
    'canvas::height': 0,
    'canvas::width': 0,
    'caption::align': 0,
    'col::align': 0,
    'col::char': 0,
    'col::charoff': 0,
    'col::span': 0,
    'col::valign': 0,
    'col::width': 0,
    'colgroup::align': 0,
    'colgroup::char': 0,
    'colgroup::charoff': 0,
    'colgroup::span': 0,
    'colgroup::valign': 0,
    'colgroup::width': 0,
    'command::checked': 0,
    'command::command': 5,
    'command::disabled': 0,
    'command::icon': 1,
    'command::label': 0,
    'command::radiogroup': 0,
    'command::type': 0,
    'data::value': 0,
    'del::cite': 1,
    'del::datetime': 0,
    'details::open': 0,
    'dir::compact': 0,
    'div::align': 0,
    'dl::compact': 0,
    'fieldset::disabled': 0,
    'font::color': 0,
    'font::face': 0,
    'font::size': 0,
    'form::accept': 0,
    'form::action': 1,
    'form::autocomplete': 0,
    'form::enctype': 0,
    'form::method': 0,
    'form::name': 7,
    'form::novalidate': 0,
    'form::onreset': 2,
    'form::onsubmit': 2,
    'form::target': 10,
    'h1::align': 0,
    'h2::align': 0,
    'h3::align': 0,
    'h4::align': 0,
    'h5::align': 0,
    'h6::align': 0,
    'hr::align': 0,
    'hr::noshade': 0,
    'hr::size': 0,
    'hr::width': 0,
    'iframe::align': 0,
    'iframe::frameborder': 0,
    'iframe::height': 0,
    'iframe::marginheight': 0,
    'iframe::marginwidth': 0,
    'iframe::width': 0,
    'img::align': 0,
    'img::alt': 0,
    'img::border': 0,
    'img::height': 0,
    'img::hspace': 0,
    'img::ismap': 0,
    'img::name': 7,
    'img::src': 1,
    'img::usemap': 11,
    'img::vspace': 0,
    'img::width': 0,
    'input::accept': 0,
    'input::accesskey': 0,
    'input::align': 0,
    'input::alt': 0,
    'input::autocomplete': 0,
    'input::checked': 0,
    'input::disabled': 0,
    'input::inputmode': 0,
    'input::ismap': 0,
    'input::list': 5,
    'input::max': 0,
    'input::maxlength': 0,
    'input::min': 0,
    'input::multiple': 0,
    'input::name': 8,
    'input::onblur': 2,
    'input::onchange': 2,
    'input::onfocus': 2,
    'input::onselect': 2,
    'input::placeholder': 0,
    'input::readonly': 0,
    'input::required': 0,
    'input::size': 0,
    'input::src': 1,
    'input::step': 0,
    'input::tabindex': 0,
    'input::type': 0,
    'input::usemap': 11,
    'input::value': 0,
    'ins::cite': 1,
    'ins::datetime': 0,
    'label::accesskey': 0,
    'label::for': 5,
    'label::onblur': 2,
    'label::onfocus': 2,
    'legend::accesskey': 0,
    'legend::align': 0,
    'li::type': 0,
    'li::value': 0,
    'map::name': 7,
    'menu::compact': 0,
    'menu::label': 0,
    'menu::type': 0,
    'meter::high': 0,
    'meter::low': 0,
    'meter::max': 0,
    'meter::min': 0,
    'meter::value': 0,
    'ol::compact': 0,
    'ol::reversed': 0,
    'ol::start': 0,
    'ol::type': 0,
    'optgroup::disabled': 0,
    'optgroup::label': 0,
    'option::disabled': 0,
    'option::label': 0,
    'option::selected': 0,
    'option::value': 0,
    'output::for': 6,
    'output::name': 8,
    'p::align': 0,
    'pre::width': 0,
    'progress::max': 0,
    'progress::min': 0,
    'progress::value': 0,
    'q::cite': 1,
    'select::autocomplete': 0,
    'select::disabled': 0,
    'select::multiple': 0,
    'select::name': 8,
    'select::onblur': 2,
    'select::onchange': 2,
    'select::onfocus': 2,
    'select::required': 0,
    'select::size': 0,
    'select::tabindex': 0,
    'source::type': 0,
    'table::align': 0,
    'table::bgcolor': 0,
    'table::border': 0,
    'table::cellpadding': 0,
    'table::cellspacing': 0,
    'table::frame': 0,
    'table::rules': 0,
    'table::summary': 0,
    'table::width': 0,
    'tbody::align': 0,
    'tbody::char': 0,
    'tbody::charoff': 0,
    'tbody::valign': 0,
    'td::abbr': 0,
    'td::align': 0,
    'td::axis': 0,
    'td::bgcolor': 0,
    'td::char': 0,
    'td::charoff': 0,
    'td::colspan': 0,
    'td::headers': 6,
    'td::height': 0,
    'td::nowrap': 0,
    'td::rowspan': 0,
    'td::scope': 0,
    'td::valign': 0,
    'td::width': 0,
    'textarea::accesskey': 0,
    'textarea::autocomplete': 0,
    'textarea::cols': 0,
    'textarea::disabled': 0,
    'textarea::inputmode': 0,
    'textarea::name': 8,
    'textarea::onblur': 2,
    'textarea::onchange': 2,
    'textarea::onfocus': 2,
    'textarea::onselect': 2,
    'textarea::placeholder': 0,
    'textarea::readonly': 0,
    'textarea::required': 0,
    'textarea::rows': 0,
    'textarea::tabindex': 0,
    'textarea::wrap': 0,
    'tfoot::align': 0,
    'tfoot::char': 0,
    'tfoot::charoff': 0,
    'tfoot::valign': 0,
    'th::abbr': 0,
    'th::align': 0,
    'th::axis': 0,
    'th::bgcolor': 0,
    'th::char': 0,
    'th::charoff': 0,
    'th::colspan': 0,
    'th::headers': 6,
    'th::height': 0,
    'th::nowrap': 0,
    'th::rowspan': 0,
    'th::scope': 0,
    'th::valign': 0,
    'th::width': 0,
    'thead::align': 0,
    'thead::char': 0,
    'thead::charoff': 0,
    'thead::valign': 0,
    'tr::align': 0,
    'tr::bgcolor': 0,
    'tr::char': 0,
    'tr::charoff': 0,
    'tr::valign': 0,
    'track::default': 0,
    'track::kind': 0,
    'track::label': 0,
    'track::srclang': 0,
    'ul::compact': 0,
    'ul::type': 0,
    'video::controls': 0,
    'video::height': 0,
    'video::loop': 0,
    'video::mediagroup': 5,
    'video::muted': 0,
    'video::poster': 1,
    'video::preload': 0,
    'video::width': 0
  };
  html4['ATTRIBS'] = html4.ATTRIBS;
  html4.eflags = {
    'OPTIONAL_ENDTAG': 1,
    'EMPTY': 2,
    'CDATA': 4,
    'RCDATA': 8,
    'UNSAFE': 16,
    'FOLDABLE': 32,
    'SCRIPT': 64,
    'STYLE': 128,
    'VIRTUALIZED': 256
  };
  html4['eflags'] = html4.eflags;
  html4.ELEMENTS = {
    'a': 0,
    'abbr': 0,
    'acronym': 0,
    'address': 0,
    'applet': 272,
    'area': 2,
    'article': 0,
    'aside': 0,
    'audio': 0,
    'b': 0,
    'base': 274,
    'basefont': 274,
    'bdi': 0,
    'bdo': 0,
    'big': 0,
    'blockquote': 0,
    'body': 305,
    'br': 2,
    'button': 0,
    'canvas': 0,
    'caption': 0,
    'center': 0,
    'cite': 0,
    'code': 0,
    'col': 2,
    'colgroup': 1,
    'command': 2,
    'data': 0,
    'datalist': 0,
    'dd': 1,
    'del': 0,
    'details': 0,
    'dfn': 0,
    'dialog': 272,
    'dir': 0,
    'div': 0,
    'dl': 0,
    'dt': 1,
    'em': 0,
    'fieldset': 0,
    'figcaption': 0,
    'figure': 0,
    'font': 0,
    'footer': 0,
    'form': 0,
    'frame': 274,
    'frameset': 272,
    'h1': 0,
    'h2': 0,
    'h3': 0,
    'h4': 0,
    'h5': 0,
    'h6': 0,
    'head': 305,
    'header': 0,
    'hgroup': 0,
    'hr': 2,
    'html': 305,
    'i': 0,
    'iframe': 16,
    'img': 2,
    'input': 2,
    'ins': 0,
    'isindex': 274,
    'kbd': 0,
    'keygen': 274,
    'label': 0,
    'legend': 0,
    'li': 1,
    'link': 274,
    'map': 0,
    'mark': 0,
    'menu': 0,
    'meta': 274,
    'meter': 0,
    'nav': 0,
    'nobr': 0,
    'noembed': 276,
    'noframes': 276,
    'noscript': 276,
    'object': 272,
    'ol': 0,
    'optgroup': 0,
    'option': 1,
    'output': 0,
    'p': 1,
    'param': 274,
    'pre': 0,
    'progress': 0,
    'q': 0,
    's': 0,
    'samp': 0,
    'script': 84,
    'section': 0,
    'select': 0,
    'small': 0,
    'source': 2,
    'span': 0,
    'strike': 0,
    'strong': 0,
    'style': 148,
    'sub': 0,
    'summary': 0,
    'sup': 0,
    'table': 0,
    'tbody': 1,
    'td': 1,
    'textarea': 8,
    'tfoot': 1,
    'th': 1,
    'thead': 1,
    'time': 0,
    'title': 280,
    'tr': 1,
    'track': 2,
    'tt': 0,
    'u': 0,
    'ul': 0,
    'var': 0,
    'video': 0,
    'wbr': 2
  };
  html4['ELEMENTS'] = html4.ELEMENTS;
  html4.ELEMENT_DOM_INTERFACES = {
    'a': 'HTMLAnchorElement',
    'abbr': 'HTMLElement',
    'acronym': 'HTMLElement',
    'address': 'HTMLElement',
    'applet': 'HTMLAppletElement',
    'area': 'HTMLAreaElement',
    'article': 'HTMLElement',
    'aside': 'HTMLElement',
    'audio': 'HTMLAudioElement',
    'b': 'HTMLElement',
    'base': 'HTMLBaseElement',
    'basefont': 'HTMLBaseFontElement',
    'bdi': 'HTMLElement',
    'bdo': 'HTMLElement',
    'big': 'HTMLElement',
    'blockquote': 'HTMLQuoteElement',
    'body': 'HTMLBodyElement',
    'br': 'HTMLBRElement',
    'button': 'HTMLButtonElement',
    'canvas': 'HTMLCanvasElement',
    'caption': 'HTMLTableCaptionElement',
    'center': 'HTMLElement',
    'cite': 'HTMLElement',
    'code': 'HTMLElement',
    'col': 'HTMLTableColElement',
    'colgroup': 'HTMLTableColElement',
    'command': 'HTMLCommandElement',
    'data': 'HTMLElement',
    'datalist': 'HTMLDataListElement',
    'dd': 'HTMLElement',
    'del': 'HTMLModElement',
    'details': 'HTMLDetailsElement',
    'dfn': 'HTMLElement',
    'dialog': 'HTMLDialogElement',
    'dir': 'HTMLDirectoryElement',
    'div': 'HTMLDivElement',
    'dl': 'HTMLDListElement',
    'dt': 'HTMLElement',
    'em': 'HTMLElement',
    'fieldset': 'HTMLFieldSetElement',
    'figcaption': 'HTMLElement',
    'figure': 'HTMLElement',
    'font': 'HTMLFontElement',
    'footer': 'HTMLElement',
    'form': 'HTMLFormElement',
    'frame': 'HTMLFrameElement',
    'frameset': 'HTMLFrameSetElement',
    'h1': 'HTMLHeadingElement',
    'h2': 'HTMLHeadingElement',
    'h3': 'HTMLHeadingElement',
    'h4': 'HTMLHeadingElement',
    'h5': 'HTMLHeadingElement',
    'h6': 'HTMLHeadingElement',
    'head': 'HTMLHeadElement',
    'header': 'HTMLElement',
    'hgroup': 'HTMLElement',
    'hr': 'HTMLHRElement',
    'html': 'HTMLHtmlElement',
    'i': 'HTMLElement',
    'iframe': 'HTMLIFrameElement',
    'img': 'HTMLImageElement',
    'input': 'HTMLInputElement',
    'ins': 'HTMLModElement',
    'isindex': 'HTMLUnknownElement',
    'kbd': 'HTMLElement',
    'keygen': 'HTMLKeygenElement',
    'label': 'HTMLLabelElement',
    'legend': 'HTMLLegendElement',
    'li': 'HTMLLIElement',
    'link': 'HTMLLinkElement',
    'map': 'HTMLMapElement',
    'mark': 'HTMLElement',
    'menu': 'HTMLMenuElement',
    'meta': 'HTMLMetaElement',
    'meter': 'HTMLMeterElement',
    'nav': 'HTMLElement',
    'nobr': 'HTMLElement',
    'noembed': 'HTMLElement',
    'noframes': 'HTMLElement',
    'noscript': 'HTMLElement',
    'object': 'HTMLObjectElement',
    'ol': 'HTMLOListElement',
    'optgroup': 'HTMLOptGroupElement',
    'option': 'HTMLOptionElement',
    'output': 'HTMLOutputElement',
    'p': 'HTMLParagraphElement',
    'param': 'HTMLParamElement',
    'pre': 'HTMLPreElement',
    'progress': 'HTMLProgressElement',
    'q': 'HTMLQuoteElement',
    's': 'HTMLElement',
    'samp': 'HTMLElement',
    'script': 'HTMLScriptElement',
    'section': 'HTMLElement',
    'select': 'HTMLSelectElement',
    'small': 'HTMLElement',
    'source': 'HTMLSourceElement',
    'span': 'HTMLSpanElement',
    'strike': 'HTMLElement',
    'strong': 'HTMLElement',
    'style': 'HTMLStyleElement',
    'sub': 'HTMLElement',
    'summary': 'HTMLElement',
    'sup': 'HTMLElement',
    'table': 'HTMLTableElement',
    'tbody': 'HTMLTableSectionElement',
    'td': 'HTMLTableDataCellElement',
    'textarea': 'HTMLTextAreaElement',
    'tfoot': 'HTMLTableSectionElement',
    'th': 'HTMLTableHeaderCellElement',
    'thead': 'HTMLTableSectionElement',
    'time': 'HTMLTimeElement',
    'title': 'HTMLTitleElement',
    'tr': 'HTMLTableRowElement',
    'track': 'HTMLTrackElement',
    'tt': 'HTMLElement',
    'u': 'HTMLElement',
    'ul': 'HTMLUListElement',
    'var': 'HTMLElement',
    'video': 'HTMLVideoElement',
    'wbr': 'HTMLElement'
  };
  html4['ELEMENT_DOM_INTERFACES'] = html4.ELEMENT_DOM_INTERFACES;
  html4.ueffects = {
    'NOT_LOADED': 0,
    'SAME_DOCUMENT': 1,
    'NEW_DOCUMENT': 2
  };
  html4['ueffects'] = html4.ueffects;
  html4.URIEFFECTS = {
    'a::href': 2,
    'area::href': 2,
    'blockquote::cite': 0,
    'command::icon': 1,
    'del::cite': 0,
    'form::action': 2,
    'img::src': 1,
    'input::src': 1,
    'ins::cite': 0,
    'q::cite': 0,
    'video::poster': 1
  };
  html4['URIEFFECTS'] = html4.URIEFFECTS;
  html4.ltypes = {
    'UNSANDBOXED': 2,
    'SANDBOXED': 1,
    'DATA': 0
  };
  html4['ltypes'] = html4.ltypes;
  html4.LOADERTYPES = {
    'a::href': 2,
    'area::href': 2,
    'blockquote::cite': 2,
    'command::icon': 1,
    'del::cite': 2,
    'form::action': 2,
    'img::src': 1,
    'input::src': 1,
    'ins::cite': 2,
    'q::cite': 2,
    'video::poster': 1
  };
  html4['LOADERTYPES'] = html4.LOADERTYPES;
  if ('I'.toLowerCase() !== 'i') {
    throw 'I/i problem';
  }
  var html = (function(html4) {
    var parseCssDeclarations,
        sanitizeCssProperty,
        cssSchema;
    if ('undefined' !== typeof window) {
      parseCssDeclarations = window['parseCssDeclarations'];
      sanitizeCssProperty = window['sanitizeCssProperty'];
      cssSchema = window['cssSchema'];
    }
    var ENTITIES = {
      'lt': '<',
      'LT': '<',
      'gt': '>',
      'GT': '>',
      'amp': '&',
      'AMP': '&',
      'quot': '"',
      'apos': '\'',
      'nbsp': '\240'
    };
    var decimalEscapeRe = /^#(\d+)$/;
    var hexEscapeRe = /^#x([0-9A-Fa-f]+)$/;
    var safeEntityNameRe = /^[A-Za-z][A-za-z0-9]+$/;
    var entityLookupElement = ('undefined' !== typeof window && window['document']) ? window['document'].createElement('textarea') : null;
    function lookupEntity(name) {
      if (ENTITIES.hasOwnProperty(name)) {
        return ENTITIES[name];
      }
      var m = name.match(decimalEscapeRe);
      if (m) {
        return String.fromCharCode(parseInt(m[1], 10));
      } else if (!!(m = name.match(hexEscapeRe))) {
        return String.fromCharCode(parseInt(m[1], 16));
      } else if (entityLookupElement && safeEntityNameRe.test(name)) {
        entityLookupElement.innerHTML = '&' + name + ';';
        var text = entityLookupElement.textContent;
        ENTITIES[name] = text;
        return text;
      } else {
        return '&' + name + ';';
      }
    }
    function decodeOneEntity(_, name) {
      return lookupEntity(name);
    }
    var nulRe = /\0/g;
    function stripNULs(s) {
      return s.replace(nulRe, '');
    }
    var ENTITY_RE_1 = /&(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/g;
    var ENTITY_RE_2 = /^(#[0-9]+|#[xX][0-9A-Fa-f]+|\w+);/;
    function unescapeEntities(s) {
      return s.replace(ENTITY_RE_1, decodeOneEntity);
    }
    var ampRe = /&/g;
    var looseAmpRe = /&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;
    var ltRe = /[<]/g;
    var gtRe = />/g;
    var quotRe = /\"/g;
    function escapeAttrib(s) {
      return ('' + s).replace(ampRe, '&amp;').replace(ltRe, '&lt;').replace(gtRe, '&gt;').replace(quotRe, '&#34;');
    }
    function normalizeRCData(rcdata) {
      return rcdata.replace(looseAmpRe, '&amp;$1').replace(ltRe, '&lt;').replace(gtRe, '&gt;');
    }
    var ATTR_RE = new RegExp('^\\s*' + '([-.:\\w]+)' + '(?:' + ('\\s*(=)\\s*' + '(' + ('(\")[^\"]*(\"|$)' + '|' + '(\')[^\']*(\'|$)' + '|' + '(?=[a-z][-\\w]*\\s*=)' + '|' + '[^\"\'\\s]*') + ')') + ')?', 'i');
    var splitWillCapture = ('a,b'.split(/(,)/).length === 3);
    var EFLAGS_TEXT = html4.eflags['CDATA'] | html4.eflags['RCDATA'];
    function makeSaxParser(handler) {
      var hcopy = {
        cdata: handler.cdata || handler['cdata'],
        comment: handler.comment || handler['comment'],
        endDoc: handler.endDoc || handler['endDoc'],
        endTag: handler.endTag || handler['endTag'],
        pcdata: handler.pcdata || handler['pcdata'],
        rcdata: handler.rcdata || handler['rcdata'],
        startDoc: handler.startDoc || handler['startDoc'],
        startTag: handler.startTag || handler['startTag']
      };
      return function(htmlText, param) {
        return parse(htmlText, hcopy, param);
      };
    }
    var continuationMarker = {};
    function parse(htmlText, handler, param) {
      var m,
          p,
          tagName;
      var parts = htmlSplit(htmlText);
      var state = {
        noMoreGT: false,
        noMoreEndComments: false
      };
      parseCPS(handler, parts, 0, state, param);
    }
    function continuationMaker(h, parts, initial, state, param) {
      return function() {
        parseCPS(h, parts, initial, state, param);
      };
    }
    function parseCPS(h, parts, initial, state, param) {
      try {
        if (h.startDoc && initial == 0) {
          h.startDoc(param);
        }
        var m,
            p,
            tagName;
        for (var pos = initial,
            end = parts.length; pos < end; ) {
          var current = parts[pos++];
          var next = parts[pos];
          switch (current) {
            case '&':
              if (ENTITY_RE_2.test(next)) {
                if (h.pcdata) {
                  h.pcdata('&' + next, param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                }
                pos++;
              } else {
                if (h.pcdata) {
                  h.pcdata("&amp;", param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                }
              }
              break;
            case '<\/':
              if (m = /^([-\w:]+)[^\'\"]*/.exec(next)) {
                if (m[0].length === next.length && parts[pos + 1] === '>') {
                  pos += 2;
                  tagName = m[1].toLowerCase();
                  if (h.endTag) {
                    h.endTag(tagName, param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                  }
                } else {
                  pos = parseEndTag(parts, pos, h, param, continuationMarker, state);
                }
              } else {
                if (h.pcdata) {
                  h.pcdata('&lt;/', param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                }
              }
              break;
            case '<':
              if (m = /^([-\w:]+)\s*\/?/.exec(next)) {
                if (m[0].length === next.length && parts[pos + 1] === '>') {
                  pos += 2;
                  tagName = m[1].toLowerCase();
                  if (h.startTag) {
                    h.startTag(tagName, [], param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                  }
                  var eflags = html4.ELEMENTS[tagName];
                  if (eflags & EFLAGS_TEXT) {
                    var tag = {
                      name: tagName,
                      next: pos,
                      eflags: eflags
                    };
                    pos = parseText(parts, tag, h, param, continuationMarker, state);
                  }
                } else {
                  pos = parseStartTag(parts, pos, h, param, continuationMarker, state);
                }
              } else {
                if (h.pcdata) {
                  h.pcdata('&lt;', param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                }
              }
              break;
            case '<\!--':
              if (!state.noMoreEndComments) {
                for (p = pos + 1; p < end; p++) {
                  if (parts[p] === '>' && /--$/.test(parts[p - 1])) {
                    break;
                  }
                }
                if (p < end) {
                  if (h.comment) {
                    var comment = parts.slice(pos, p).join('');
                    h.comment(comment.substr(0, comment.length - 2), param, continuationMarker, continuationMaker(h, parts, p + 1, state, param));
                  }
                  pos = p + 1;
                } else {
                  state.noMoreEndComments = true;
                }
              }
              if (state.noMoreEndComments) {
                if (h.pcdata) {
                  h.pcdata('&lt;!--', param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                }
              }
              break;
            case '<\!':
              if (!/^\w/.test(next)) {
                if (h.pcdata) {
                  h.pcdata('&lt;!', param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                }
              } else {
                if (!state.noMoreGT) {
                  for (p = pos + 1; p < end; p++) {
                    if (parts[p] === '>') {
                      break;
                    }
                  }
                  if (p < end) {
                    pos = p + 1;
                  } else {
                    state.noMoreGT = true;
                  }
                }
                if (state.noMoreGT) {
                  if (h.pcdata) {
                    h.pcdata('&lt;!', param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                  }
                }
              }
              break;
            case '<?':
              if (!state.noMoreGT) {
                for (p = pos + 1; p < end; p++) {
                  if (parts[p] === '>') {
                    break;
                  }
                }
                if (p < end) {
                  pos = p + 1;
                } else {
                  state.noMoreGT = true;
                }
              }
              if (state.noMoreGT) {
                if (h.pcdata) {
                  h.pcdata('&lt;?', param, continuationMarker, continuationMaker(h, parts, pos, state, param));
                }
              }
              break;
            case '>':
              if (h.pcdata) {
                h.pcdata("&gt;", param, continuationMarker, continuationMaker(h, parts, pos, state, param));
              }
              break;
            case '':
              break;
            default:
              if (h.pcdata) {
                h.pcdata(current, param, continuationMarker, continuationMaker(h, parts, pos, state, param));
              }
              break;
          }
        }
        if (h.endDoc) {
          h.endDoc(param);
        }
      } catch (e) {
        if (e !== continuationMarker) {
          throw e;
        }
      }
    }
    function htmlSplit(str) {
      var re = /(<\/|<\!--|<[!?]|[&<>])/g;
      str += '';
      if (splitWillCapture) {
        return str.split(re);
      } else {
        var parts = [];
        var lastPos = 0;
        var m;
        while ((m = re.exec(str)) !== null) {
          parts.push(str.substring(lastPos, m.index));
          parts.push(m[0]);
          lastPos = m.index + m[0].length;
        }
        parts.push(str.substring(lastPos));
        return parts;
      }
    }
    function parseEndTag(parts, pos, h, param, continuationMarker, state) {
      var tag = parseTagAndAttrs(parts, pos);
      if (!tag) {
        return parts.length;
      }
      if (h.endTag) {
        h.endTag(tag.name, param, continuationMarker, continuationMaker(h, parts, pos, state, param));
      }
      return tag.next;
    }
    function parseStartTag(parts, pos, h, param, continuationMarker, state) {
      var tag = parseTagAndAttrs(parts, pos);
      if (!tag) {
        return parts.length;
      }
      if (h.startTag) {
        h.startTag(tag.name, tag.attrs, param, continuationMarker, continuationMaker(h, parts, tag.next, state, param));
      }
      if (tag.eflags & EFLAGS_TEXT) {
        return parseText(parts, tag, h, param, continuationMarker, state);
      } else {
        return tag.next;
      }
    }
    var endTagRe = {};
    function parseText(parts, tag, h, param, continuationMarker, state) {
      var end = parts.length;
      if (!endTagRe.hasOwnProperty(tag.name)) {
        endTagRe[tag.name] = new RegExp('^' + tag.name + '(?:[\\s\\/]|$)', 'i');
      }
      var re = endTagRe[tag.name];
      var first = tag.next;
      var p = tag.next + 1;
      for (; p < end; p++) {
        if (parts[p - 1] === '<\/' && re.test(parts[p])) {
          break;
        }
      }
      if (p < end) {
        p -= 1;
      }
      var buf = parts.slice(first, p).join('');
      if (tag.eflags & html4.eflags['CDATA']) {
        if (h.cdata) {
          h.cdata(buf, param, continuationMarker, continuationMaker(h, parts, p, state, param));
        }
      } else if (tag.eflags & html4.eflags['RCDATA']) {
        if (h.rcdata) {
          h.rcdata(normalizeRCData(buf), param, continuationMarker, continuationMaker(h, parts, p, state, param));
        }
      } else {
        throw new Error('bug');
      }
      return p;
    }
    function parseTagAndAttrs(parts, pos) {
      var m = /^([-\w:]+)/.exec(parts[pos]);
      var tag = {};
      tag.name = m[1].toLowerCase();
      tag.eflags = html4.ELEMENTS[tag.name];
      var buf = parts[pos].substr(m[0].length);
      var p = pos + 1;
      var end = parts.length;
      for (; p < end; p++) {
        if (parts[p] === '>') {
          break;
        }
        buf += parts[p];
      }
      if (end <= p) {
        return void 0;
      }
      var attrs = [];
      while (buf !== '') {
        m = ATTR_RE.exec(buf);
        if (!m) {
          buf = buf.replace(/^[\s\S][^a-z\s]*/, '');
        } else if ((m[4] && !m[5]) || (m[6] && !m[7])) {
          var quote = m[4] || m[6];
          var sawQuote = false;
          var abuf = [buf, parts[p++]];
          for (; p < end; p++) {
            if (sawQuote) {
              if (parts[p] === '>') {
                break;
              }
            } else if (0 <= parts[p].indexOf(quote)) {
              sawQuote = true;
            }
            abuf.push(parts[p]);
          }
          if (end <= p) {
            break;
          }
          buf = abuf.join('');
          continue;
        } else {
          var aName = m[1].toLowerCase();
          var aValue = m[2] ? decodeValue(m[3]) : '';
          attrs.push(aName, aValue);
          buf = buf.substr(m[0].length);
        }
      }
      tag.attrs = attrs;
      tag.next = p + 1;
      return tag;
    }
    function decodeValue(v) {
      var q = v.charCodeAt(0);
      if (q === 0x22 || q === 0x27) {
        v = v.substr(1, v.length - 2);
      }
      return unescapeEntities(stripNULs(v));
    }
    function makeHtmlSanitizer(tagPolicy) {
      var stack;
      var ignoring;
      var emit = function(text, out) {
        if (!ignoring) {
          out.push(text);
        }
      };
      return makeSaxParser({
        'startDoc': function(_) {
          stack = [];
          ignoring = false;
        },
        'startTag': function(tagNameOrig, attribs, out) {
          if (ignoring) {
            return;
          }
          if (!html4.ELEMENTS.hasOwnProperty(tagNameOrig)) {
            return;
          }
          var eflagsOrig = html4.ELEMENTS[tagNameOrig];
          if (eflagsOrig & html4.eflags['FOLDABLE']) {
            return;
          }
          var decision = tagPolicy(tagNameOrig, attribs);
          if (!decision) {
            ignoring = !(eflagsOrig & html4.eflags['EMPTY']);
            return;
          } else if (typeof decision !== 'object') {
            throw new Error('tagPolicy did not return object (old API?)');
          }
          if ('attribs' in decision) {
            attribs = decision['attribs'];
          } else {
            throw new Error('tagPolicy gave no attribs');
          }
          var eflagsRep;
          var tagNameRep;
          if ('tagName' in decision) {
            tagNameRep = decision['tagName'];
            eflagsRep = html4.ELEMENTS[tagNameRep];
          } else {
            tagNameRep = tagNameOrig;
            eflagsRep = eflagsOrig;
          }
          if (eflagsOrig & html4.eflags['OPTIONAL_ENDTAG']) {
            var onStack = stack[stack.length - 1];
            if (onStack && onStack.orig === tagNameOrig && (onStack.rep !== tagNameRep || tagNameOrig !== tagNameRep)) {
              out.push('<\/', onStack.rep, '>');
            }
          }
          if (!(eflagsOrig & html4.eflags['EMPTY'])) {
            stack.push({
              orig: tagNameOrig,
              rep: tagNameRep
            });
          }
          out.push('<', tagNameRep);
          for (var i = 0,
              n = attribs.length; i < n; i += 2) {
            var attribName = attribs[i],
                value = attribs[i + 1];
            if (value !== null && value !== void 0) {
              out.push(' ', attribName, '="', escapeAttrib(value), '"');
            }
          }
          out.push('>');
          if ((eflagsOrig & html4.eflags['EMPTY']) && !(eflagsRep & html4.eflags['EMPTY'])) {
            out.push('<\/', tagNameRep, '>');
          }
        },
        'endTag': function(tagName, out) {
          if (ignoring) {
            ignoring = false;
            return;
          }
          if (!html4.ELEMENTS.hasOwnProperty(tagName)) {
            return;
          }
          var eflags = html4.ELEMENTS[tagName];
          if (!(eflags & (html4.eflags['EMPTY'] | html4.eflags['FOLDABLE']))) {
            var index;
            if (eflags & html4.eflags['OPTIONAL_ENDTAG']) {
              for (index = stack.length; --index >= 0; ) {
                var stackElOrigTag = stack[index].orig;
                if (stackElOrigTag === tagName) {
                  break;
                }
                if (!(html4.ELEMENTS[stackElOrigTag] & html4.eflags['OPTIONAL_ENDTAG'])) {
                  return;
                }
              }
            } else {
              for (index = stack.length; --index >= 0; ) {
                if (stack[index].orig === tagName) {
                  break;
                }
              }
            }
            if (index < 0) {
              return;
            }
            for (var i = stack.length; --i > index; ) {
              var stackElRepTag = stack[i].rep;
              if (!(html4.ELEMENTS[stackElRepTag] & html4.eflags['OPTIONAL_ENDTAG'])) {
                out.push('<\/', stackElRepTag, '>');
              }
            }
            if (index < stack.length) {
              tagName = stack[index].rep;
            }
            stack.length = index;
            out.push('<\/', tagName, '>');
          }
        },
        'pcdata': emit,
        'rcdata': emit,
        'cdata': emit,
        'endDoc': function(out) {
          for (; stack.length; stack.length--) {
            out.push('<\/', stack[stack.length - 1].rep, '>');
          }
        }
      });
    }
    var ALLOWED_URI_SCHEMES = /^(?:https?|mailto|data)$/i;
    function safeUri(uri, effect, ltype, hints, naiveUriRewriter) {
      if (!naiveUriRewriter) {
        return null;
      }
      try {
        var parsed = URI.parse('' + uri);
        if (parsed) {
          if (!parsed.hasScheme() || ALLOWED_URI_SCHEMES.test(parsed.getScheme())) {
            var safe = naiveUriRewriter(parsed, effect, ltype, hints);
            return safe ? safe.toString() : null;
          }
        }
      } catch (e) {
        return null;
      }
      return null;
    }
    function log(logger, tagName, attribName, oldValue, newValue) {
      if (!attribName) {
        logger(tagName + " removed", {
          change: "removed",
          tagName: tagName
        });
      }
      if (oldValue !== newValue) {
        var changed = "changed";
        if (oldValue && !newValue) {
          changed = "removed";
        } else if (!oldValue && newValue) {
          changed = "added";
        }
        logger(tagName + "." + attribName + " " + changed, {
          change: changed,
          tagName: tagName,
          attribName: attribName,
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }
    function lookupAttribute(map, tagName, attribName) {
      var attribKey;
      attribKey = tagName + '::' + attribName;
      if (map.hasOwnProperty(attribKey)) {
        return map[attribKey];
      }
      attribKey = '*::' + attribName;
      if (map.hasOwnProperty(attribKey)) {
        return map[attribKey];
      }
      return void 0;
    }
    function getAttributeType(tagName, attribName) {
      return lookupAttribute(html4.ATTRIBS, tagName, attribName);
    }
    function getLoaderType(tagName, attribName) {
      return lookupAttribute(html4.LOADERTYPES, tagName, attribName);
    }
    function getUriEffect(tagName, attribName) {
      return lookupAttribute(html4.URIEFFECTS, tagName, attribName);
    }
    function sanitizeAttribs(tagName, attribs, opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
      for (var i = 0; i < attribs.length; i += 2) {
        var attribName = attribs[i];
        var value = attribs[i + 1];
        var oldValue = value;
        var atype = null,
            attribKey;
        if ((attribKey = tagName + '::' + attribName, html4.ATTRIBS.hasOwnProperty(attribKey)) || (attribKey = '*::' + attribName, html4.ATTRIBS.hasOwnProperty(attribKey))) {
          atype = html4.ATTRIBS[attribKey];
        }
        if (atype !== null) {
          switch (atype) {
            case html4.atype['NONE']:
              break;
            case html4.atype['SCRIPT']:
              value = null;
              if (opt_logger) {
                log(opt_logger, tagName, attribName, oldValue, value);
              }
              break;
            case html4.atype['STYLE']:
              if ('undefined' === typeof parseCssDeclarations) {
                value = null;
                if (opt_logger) {
                  log(opt_logger, tagName, attribName, oldValue, value);
                }
                break;
              }
              var sanitizedDeclarations = [];
              parseCssDeclarations(value, {declaration: function(property, tokens) {
                  var normProp = property.toLowerCase();
                  var schema = cssSchema[normProp];
                  if (!schema) {
                    return;
                  }
                  sanitizeCssProperty(normProp, schema, tokens, opt_naiveUriRewriter ? function(url) {
                    return safeUri(url, html4.ueffects.SAME_DOCUMENT, html4.ltypes.SANDBOXED, {
                      "TYPE": "CSS",
                      "CSS_PROP": normProp
                    }, opt_naiveUriRewriter);
                  } : null);
                  sanitizedDeclarations.push(property + ': ' + tokens.join(' '));
                }});
              value = sanitizedDeclarations.length > 0 ? sanitizedDeclarations.join(' ; ') : null;
              if (opt_logger) {
                log(opt_logger, tagName, attribName, oldValue, value);
              }
              break;
            case html4.atype['ID']:
            case html4.atype['IDREF']:
            case html4.atype['IDREFS']:
            case html4.atype['GLOBAL_NAME']:
            case html4.atype['LOCAL_NAME']:
            case html4.atype['CLASSES']:
              value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;
              if (opt_logger) {
                log(opt_logger, tagName, attribName, oldValue, value);
              }
              break;
            case html4.atype['URI']:
              value = safeUri(value, getUriEffect(tagName, attribName), getLoaderType(tagName, attribName), {
                "TYPE": "MARKUP",
                "XML_ATTR": attribName,
                "XML_TAG": tagName
              }, opt_naiveUriRewriter);
              if (opt_logger) {
                log(opt_logger, tagName, attribName, oldValue, value);
              }
              break;
            case html4.atype['URI_FRAGMENT']:
              if (value && '#' === value.charAt(0)) {
                value = value.substring(1);
                value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;
                if (value !== null && value !== void 0) {
                  value = '#' + value;
                }
              } else {
                value = null;
              }
              if (opt_logger) {
                log(opt_logger, tagName, attribName, oldValue, value);
              }
              break;
            default:
              value = null;
              if (opt_logger) {
                log(opt_logger, tagName, attribName, oldValue, value);
              }
              break;
          }
        } else {
          value = null;
          if (opt_logger) {
            log(opt_logger, tagName, attribName, oldValue, value);
          }
        }
        attribs[i + 1] = value;
      }
      return attribs;
    }
    function makeTagPolicy(opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
      return function(tagName, attribs) {
        if (!(html4.ELEMENTS[tagName] & html4.eflags['UNSAFE'])) {
          return {'attribs': sanitizeAttribs(tagName, attribs, opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger)};
        } else {
          if (opt_logger) {
            log(opt_logger, tagName, undefined, undefined, undefined);
          }
        }
      };
    }
    function sanitizeWithPolicy(inputHtml, tagPolicy) {
      var outputArray = [];
      makeHtmlSanitizer(tagPolicy)(inputHtml, outputArray);
      return outputArray.join('');
    }
    function sanitize(inputHtml, opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger) {
      var tagPolicy = makeTagPolicy(opt_naiveUriRewriter, opt_nmTokenPolicy, opt_logger);
      return sanitizeWithPolicy(inputHtml, tagPolicy);
    }
    var html = {};
    html.escapeAttrib = html['escapeAttrib'] = escapeAttrib;
    html.makeHtmlSanitizer = html['makeHtmlSanitizer'] = makeHtmlSanitizer;
    html.makeSaxParser = html['makeSaxParser'] = makeSaxParser;
    html.makeTagPolicy = html['makeTagPolicy'] = makeTagPolicy;
    html.normalizeRCData = html['normalizeRCData'] = normalizeRCData;
    html.sanitize = html['sanitize'] = sanitize;
    html.sanitizeAttribs = html['sanitizeAttribs'] = sanitizeAttribs;
    html.sanitizeWithPolicy = html['sanitizeWithPolicy'] = sanitizeWithPolicy;
    html.unescapeEntities = html['unescapeEntities'] = unescapeEntities;
    return html;
  })(html4);
  var html_sanitize = html['sanitize'];
  html4.ATTRIBS['*::style'] = 0;
  html4.ELEMENTS['style'] = 0;
  html4.ATTRIBS['a::target'] = 0;
  html4.ELEMENTS['video'] = 0;
  html4.ATTRIBS['video::src'] = 0;
  html4.ATTRIBS['video::poster'] = 0;
  html4.ATTRIBS['video::controls'] = 0;
  html4.ELEMENTS['audio'] = 0;
  html4.ATTRIBS['audio::src'] = 0;
  html4.ATTRIBS['video::autoplay'] = 0;
  html4.ATTRIBS['video::controls'] = 0;
  if (typeof module !== 'undefined') {
    module.exports = html_sanitize;
  }
})(require('process'));

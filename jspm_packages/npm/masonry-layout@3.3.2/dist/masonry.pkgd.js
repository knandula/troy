/* */ 
"format cjs";
(function(process) {
  (function(window) {
    var slice = Array.prototype.slice;
    function noop() {}
    function defineBridget($) {
      if (!$) {
        return;
      }
      function addOptionMethod(PluginClass) {
        if (PluginClass.prototype.option) {
          return;
        }
        PluginClass.prototype.option = function(opts) {
          if (!$.isPlainObject(opts)) {
            return;
          }
          this.options = $.extend(true, this.options, opts);
        };
      }
      var logError = typeof console === 'undefined' ? noop : function(message) {
        console.error(message);
      };
      function bridge(namespace, PluginClass) {
        $.fn[namespace] = function(options) {
          if (typeof options === 'string') {
            var args = slice.call(arguments, 1);
            for (var i = 0,
                len = this.length; i < len; i++) {
              var elem = this[i];
              var instance = $.data(elem, namespace);
              if (!instance) {
                logError("cannot call methods on " + namespace + " prior to initialization; " + "attempted to call '" + options + "'");
                continue;
              }
              if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                logError("no such method '" + options + "' for " + namespace + " instance");
                continue;
              }
              var returnValue = instance[options].apply(instance, args);
              if (returnValue !== undefined) {
                return returnValue;
              }
            }
            return this;
          } else {
            return this.each(function() {
              var instance = $.data(this, namespace);
              if (instance) {
                instance.option(options);
                instance._init();
              } else {
                instance = new PluginClass(this, options);
                $.data(this, namespace, instance);
              }
            });
          }
        };
      }
      $.bridget = function(namespace, PluginClass) {
        addOptionMethod(PluginClass);
        bridge(namespace, PluginClass);
      };
      return $.bridget;
    }
    if (typeof define === 'function' && define.amd) {
      define('jquery-bridget/jquery.bridget', ['jquery'], defineBridget);
    } else if (typeof exports === 'object') {
      defineBridget(require('jquery'));
    } else {
      defineBridget(window.jQuery);
    }
  })(window);
  (function(window) {
    var docElem = document.documentElement;
    var bind = function() {};
    function getIEEvent(obj) {
      var event = window.event;
      event.target = event.target || event.srcElement || obj;
      return event;
    }
    if (docElem.addEventListener) {
      bind = function(obj, type, fn) {
        obj.addEventListener(type, fn, false);
      };
    } else if (docElem.attachEvent) {
      bind = function(obj, type, fn) {
        obj[type + fn] = fn.handleEvent ? function() {
          var event = getIEEvent(obj);
          fn.handleEvent.call(fn, event);
        } : function() {
          var event = getIEEvent(obj);
          fn.call(obj, event);
        };
        obj.attachEvent("on" + type, obj[type + fn]);
      };
    }
    var unbind = function() {};
    if (docElem.removeEventListener) {
      unbind = function(obj, type, fn) {
        obj.removeEventListener(type, fn, false);
      };
    } else if (docElem.detachEvent) {
      unbind = function(obj, type, fn) {
        obj.detachEvent("on" + type, obj[type + fn]);
        try {
          delete obj[type + fn];
        } catch (err) {
          obj[type + fn] = undefined;
        }
      };
    }
    var eventie = {
      bind: bind,
      unbind: unbind
    };
    if (typeof define === 'function' && define.amd) {
      define('eventie/eventie', eventie);
    } else if (typeof exports === 'object') {
      module.exports = eventie;
    } else {
      window.eventie = eventie;
    }
  })(window);
  ;
  (function() {
    function EventEmitter() {}
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;
    function indexOfListener(listeners, listener) {
      var i = listeners.length;
      while (i--) {
        if (listeners[i].listener === listener) {
          return i;
        }
      }
      return -1;
    }
    function alias(name) {
      return function aliasClosure() {
        return this[name].apply(this, arguments);
      };
    }
    proto.getListeners = function getListeners(evt) {
      var events = this._getEvents();
      var response;
      var key;
      if (evt instanceof RegExp) {
        response = {};
        for (key in events) {
          if (events.hasOwnProperty(key) && evt.test(key)) {
            response[key] = events[key];
          }
        }
      } else {
        response = events[evt] || (events[evt] = []);
      }
      return response;
    };
    proto.flattenListeners = function flattenListeners(listeners) {
      var flatListeners = [];
      var i;
      for (i = 0; i < listeners.length; i += 1) {
        flatListeners.push(listeners[i].listener);
      }
      return flatListeners;
    };
    proto.getListenersAsObject = function getListenersAsObject(evt) {
      var listeners = this.getListeners(evt);
      var response;
      if (listeners instanceof Array) {
        response = {};
        response[evt] = listeners;
      }
      return response || listeners;
    };
    proto.addListener = function addListener(evt, listener) {
      var listeners = this.getListenersAsObject(evt);
      var listenerIsWrapped = typeof listener === 'object';
      var key;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
          listeners[key].push(listenerIsWrapped ? listener : {
            listener: listener,
            once: false
          });
        }
      }
      return this;
    };
    proto.on = alias('addListener');
    proto.addOnceListener = function addOnceListener(evt, listener) {
      return this.addListener(evt, {
        listener: listener,
        once: true
      });
    };
    proto.once = alias('addOnceListener');
    proto.defineEvent = function defineEvent(evt) {
      this.getListeners(evt);
      return this;
    };
    proto.defineEvents = function defineEvents(evts) {
      for (var i = 0; i < evts.length; i += 1) {
        this.defineEvent(evts[i]);
      }
      return this;
    };
    proto.removeListener = function removeListener(evt, listener) {
      var listeners = this.getListenersAsObject(evt);
      var index;
      var key;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key)) {
          index = indexOfListener(listeners[key], listener);
          if (index !== -1) {
            listeners[key].splice(index, 1);
          }
        }
      }
      return this;
    };
    proto.off = alias('removeListener');
    proto.addListeners = function addListeners(evt, listeners) {
      return this.manipulateListeners(false, evt, listeners);
    };
    proto.removeListeners = function removeListeners(evt, listeners) {
      return this.manipulateListeners(true, evt, listeners);
    };
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
      var i;
      var value;
      var single = remove ? this.removeListener : this.addListener;
      var multiple = remove ? this.removeListeners : this.addListeners;
      if (typeof evt === 'object' && !(evt instanceof RegExp)) {
        for (i in evt) {
          if (evt.hasOwnProperty(i) && (value = evt[i])) {
            if (typeof value === 'function') {
              single.call(this, i, value);
            } else {
              multiple.call(this, i, value);
            }
          }
        }
      } else {
        i = listeners.length;
        while (i--) {
          single.call(this, evt, listeners[i]);
        }
      }
      return this;
    };
    proto.removeEvent = function removeEvent(evt) {
      var type = typeof evt;
      var events = this._getEvents();
      var key;
      if (type === 'string') {
        delete events[evt];
      } else if (evt instanceof RegExp) {
        for (key in events) {
          if (events.hasOwnProperty(key) && evt.test(key)) {
            delete events[key];
          }
        }
      } else {
        delete this._events;
      }
      return this;
    };
    proto.removeAllListeners = alias('removeEvent');
    proto.emitEvent = function emitEvent(evt, args) {
      var listeners = this.getListenersAsObject(evt);
      var listener;
      var i;
      var key;
      var response;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key)) {
          i = listeners[key].length;
          while (i--) {
            listener = listeners[key][i];
            if (listener.once === true) {
              this.removeListener(evt, listener.listener);
            }
            response = listener.listener.apply(this, args || []);
            if (response === this._getOnceReturnValue()) {
              this.removeListener(evt, listener.listener);
            }
          }
        }
      }
      return this;
    };
    proto.trigger = alias('emitEvent');
    proto.emit = function emit(evt) {
      var args = Array.prototype.slice.call(arguments, 1);
      return this.emitEvent(evt, args);
    };
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
      this._onceReturnValue = value;
      return this;
    };
    proto._getOnceReturnValue = function _getOnceReturnValue() {
      if (this.hasOwnProperty('_onceReturnValue')) {
        return this._onceReturnValue;
      } else {
        return true;
      }
    };
    proto._getEvents = function _getEvents() {
      return this._events || (this._events = {});
    };
    EventEmitter.noConflict = function noConflict() {
      exports.EventEmitter = originalGlobalValue;
      return EventEmitter;
    };
    if (typeof define === 'function' && define.amd) {
      define('eventEmitter/EventEmitter', [], function() {
        return EventEmitter;
      });
    } else if (typeof module === 'object' && module.exports) {
      module.exports = EventEmitter;
    } else {
      exports.EventEmitter = EventEmitter;
    }
  }.call(this));
  (function(window) {
    var prefixes = 'Webkit Moz ms Ms O'.split(' ');
    var docElemStyle = document.documentElement.style;
    function getStyleProperty(propName) {
      if (!propName) {
        return;
      }
      if (typeof docElemStyle[propName] === 'string') {
        return propName;
      }
      propName = propName.charAt(0).toUpperCase() + propName.slice(1);
      var prefixed;
      for (var i = 0,
          len = prefixes.length; i < len; i++) {
        prefixed = prefixes[i] + propName;
        if (typeof docElemStyle[prefixed] === 'string') {
          return prefixed;
        }
      }
    }
    if (typeof define === 'function' && define.amd) {
      define('get-style-property/get-style-property', [], function() {
        return getStyleProperty;
      });
    } else if (typeof exports === 'object') {
      module.exports = getStyleProperty;
    } else {
      window.getStyleProperty = getStyleProperty;
    }
  })(window);
  (function(window, undefined) {
    function getStyleSize(value) {
      var num = parseFloat(value);
      var isValid = value.indexOf('%') === -1 && !isNaN(num);
      return isValid && num;
    }
    function noop() {}
    var logError = typeof console === 'undefined' ? noop : function(message) {
      console.error(message);
    };
    var measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];
    function getZeroSize() {
      var size = {
        width: 0,
        height: 0,
        innerWidth: 0,
        innerHeight: 0,
        outerWidth: 0,
        outerHeight: 0
      };
      for (var i = 0,
          len = measurements.length; i < len; i++) {
        var measurement = measurements[i];
        size[measurement] = 0;
      }
      return size;
    }
    function defineGetSize(getStyleProperty) {
      var isSetup = false;
      var getStyle,
          boxSizingProp,
          isBoxSizeOuter;
      function setup() {
        if (isSetup) {
          return;
        }
        isSetup = true;
        var getComputedStyle = window.getComputedStyle;
        getStyle = (function() {
          var getStyleFn = getComputedStyle ? function(elem) {
            return getComputedStyle(elem, null);
          } : function(elem) {
            return elem.currentStyle;
          };
          return function getStyle(elem) {
            var style = getStyleFn(elem);
            if (!style) {
              logError('Style returned ' + style + '. Are you running this code in a hidden iframe on Firefox? ' + 'See http://bit.ly/getsizebug1');
            }
            return style;
          };
        })();
        boxSizingProp = getStyleProperty('boxSizing');
        if (boxSizingProp) {
          var div = document.createElement('div');
          div.style.width = '200px';
          div.style.padding = '1px 2px 3px 4px';
          div.style.borderStyle = 'solid';
          div.style.borderWidth = '1px 2px 3px 4px';
          div.style[boxSizingProp] = 'border-box';
          var body = document.body || document.documentElement;
          body.appendChild(div);
          var style = getStyle(div);
          isBoxSizeOuter = getStyleSize(style.width) === 200;
          body.removeChild(div);
        }
      }
      function getSize(elem) {
        setup();
        if (typeof elem === 'string') {
          elem = document.querySelector(elem);
        }
        if (!elem || typeof elem !== 'object' || !elem.nodeType) {
          return;
        }
        var style = getStyle(elem);
        if (style.display === 'none') {
          return getZeroSize();
        }
        var size = {};
        size.width = elem.offsetWidth;
        size.height = elem.offsetHeight;
        var isBorderBox = size.isBorderBox = !!(boxSizingProp && style[boxSizingProp] && style[boxSizingProp] === 'border-box');
        for (var i = 0,
            len = measurements.length; i < len; i++) {
          var measurement = measurements[i];
          var value = style[measurement];
          value = mungeNonPixel(elem, value);
          var num = parseFloat(value);
          size[measurement] = !isNaN(num) ? num : 0;
        }
        var paddingWidth = size.paddingLeft + size.paddingRight;
        var paddingHeight = size.paddingTop + size.paddingBottom;
        var marginWidth = size.marginLeft + size.marginRight;
        var marginHeight = size.marginTop + size.marginBottom;
        var borderWidth = size.borderLeftWidth + size.borderRightWidth;
        var borderHeight = size.borderTopWidth + size.borderBottomWidth;
        var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
        var styleWidth = getStyleSize(style.width);
        if (styleWidth !== false) {
          size.width = styleWidth + (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
        }
        var styleHeight = getStyleSize(style.height);
        if (styleHeight !== false) {
          size.height = styleHeight + (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
        }
        size.innerWidth = size.width - (paddingWidth + borderWidth);
        size.innerHeight = size.height - (paddingHeight + borderHeight);
        size.outerWidth = size.width + marginWidth;
        size.outerHeight = size.height + marginHeight;
        return size;
      }
      function mungeNonPixel(elem, value) {
        if (window.getComputedStyle || value.indexOf('%') === -1) {
          return value;
        }
        var style = elem.style;
        var left = style.left;
        var rs = elem.runtimeStyle;
        var rsLeft = rs && rs.left;
        if (rsLeft) {
          rs.left = elem.currentStyle.left;
        }
        style.left = value;
        value = style.pixelLeft;
        style.left = left;
        if (rsLeft) {
          rs.left = rsLeft;
        }
        return value;
      }
      return getSize;
    }
    if (typeof define === 'function' && define.amd) {
      define('get-size/get-size', ['get-style-property/get-style-property'], defineGetSize);
    } else if (typeof exports === 'object') {
      module.exports = defineGetSize(require('desandro-get-style-property'));
    } else {
      window.getSize = defineGetSize(window.getStyleProperty);
    }
  })(window);
  (function(window) {
    var document = window.document;
    var queue = [];
    function docReady(fn) {
      if (typeof fn !== 'function') {
        return;
      }
      if (docReady.isReady) {
        fn();
      } else {
        queue.push(fn);
      }
    }
    docReady.isReady = false;
    function onReady(event) {
      var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
      if (docReady.isReady || isIE8NotReady) {
        return;
      }
      trigger();
    }
    function trigger() {
      docReady.isReady = true;
      for (var i = 0,
          len = queue.length; i < len; i++) {
        var fn = queue[i];
        fn();
      }
    }
    function defineDocReady(eventie) {
      if (document.readyState === 'complete') {
        trigger();
      } else {
        eventie.bind(document, 'DOMContentLoaded', onReady);
        eventie.bind(document, 'readystatechange', onReady);
        eventie.bind(window, 'load', onReady);
      }
      return docReady;
    }
    if (typeof define === 'function' && define.amd) {
      define('doc-ready/doc-ready', ['eventie/eventie'], defineDocReady);
    } else if (typeof exports === 'object') {
      module.exports = defineDocReady(require('eventie'));
    } else {
      window.docReady = defineDocReady(window.eventie);
    }
  })(window);
  (function(ElemProto) {
    var matchesMethod = (function() {
      if (ElemProto.matches) {
        return 'matches';
      }
      if (ElemProto.matchesSelector) {
        return 'matchesSelector';
      }
      var prefixes = ['webkit', 'moz', 'ms', 'o'];
      for (var i = 0,
          len = prefixes.length; i < len; i++) {
        var prefix = prefixes[i];
        var method = prefix + 'MatchesSelector';
        if (ElemProto[method]) {
          return method;
        }
      }
    })();
    function match(elem, selector) {
      return elem[matchesMethod](selector);
    }
    function checkParent(elem) {
      if (elem.parentNode) {
        return;
      }
      var fragment = document.createDocumentFragment();
      fragment.appendChild(elem);
    }
    function query(elem, selector) {
      checkParent(elem);
      var elems = elem.parentNode.querySelectorAll(selector);
      for (var i = 0,
          len = elems.length; i < len; i++) {
        if (elems[i] === elem) {
          return true;
        }
      }
      return false;
    }
    function matchChild(elem, selector) {
      checkParent(elem);
      return match(elem, selector);
    }
    var matchesSelector;
    if (matchesMethod) {
      var div = document.createElement('div');
      var supportsOrphans = match(div, 'div');
      matchesSelector = supportsOrphans ? match : matchChild;
    } else {
      matchesSelector = query;
    }
    if (typeof define === 'function' && define.amd) {
      define('matches-selector/matches-selector', [], function() {
        return matchesSelector;
      });
    } else if (typeof exports === 'object') {
      module.exports = matchesSelector;
    } else {
      window.matchesSelector = matchesSelector;
    }
  })(Element.prototype);
  (function(window, factory) {
    if (typeof define == 'function' && define.amd) {
      define('fizzy-ui-utils/utils', ['doc-ready/doc-ready', 'matches-selector/matches-selector'], function(docReady, matchesSelector) {
        return factory(window, docReady, matchesSelector);
      });
    } else if (typeof exports == 'object') {
      module.exports = factory(window, require('doc-ready'), require('desandro-matches-selector'));
    } else {
      window.fizzyUIUtils = factory(window, window.docReady, window.matchesSelector);
    }
  }(window, function factory(window, docReady, matchesSelector) {
    var utils = {};
    utils.extend = function(a, b) {
      for (var prop in b) {
        a[prop] = b[prop];
      }
      return a;
    };
    utils.modulo = function(num, div) {
      return ((num % div) + div) % div;
    };
    var objToString = Object.prototype.toString;
    utils.isArray = function(obj) {
      return objToString.call(obj) == '[object Array]';
    };
    utils.makeArray = function(obj) {
      var ary = [];
      if (utils.isArray(obj)) {
        ary = obj;
      } else if (obj && typeof obj.length == 'number') {
        for (var i = 0,
            len = obj.length; i < len; i++) {
          ary.push(obj[i]);
        }
      } else {
        ary.push(obj);
      }
      return ary;
    };
    utils.indexOf = Array.prototype.indexOf ? function(ary, obj) {
      return ary.indexOf(obj);
    } : function(ary, obj) {
      for (var i = 0,
          len = ary.length; i < len; i++) {
        if (ary[i] === obj) {
          return i;
        }
      }
      return -1;
    };
    utils.removeFrom = function(ary, obj) {
      var index = utils.indexOf(ary, obj);
      if (index != -1) {
        ary.splice(index, 1);
      }
    };
    utils.isElement = (typeof HTMLElement == 'function' || typeof HTMLElement == 'object') ? function isElementDOM2(obj) {
      return obj instanceof HTMLElement;
    } : function isElementQuirky(obj) {
      return obj && typeof obj == 'object' && obj.nodeType == 1 && typeof obj.nodeName == 'string';
    };
    utils.setText = (function() {
      var setTextProperty;
      function setText(elem, text) {
        setTextProperty = setTextProperty || (document.documentElement.textContent !== undefined ? 'textContent' : 'innerText');
        elem[setTextProperty] = text;
      }
      return setText;
    })();
    utils.getParent = function(elem, selector) {
      while (elem != document.body) {
        elem = elem.parentNode;
        if (matchesSelector(elem, selector)) {
          return elem;
        }
      }
    };
    utils.getQueryElement = function(elem) {
      if (typeof elem == 'string') {
        return document.querySelector(elem);
      }
      return elem;
    };
    utils.handleEvent = function(event) {
      var method = 'on' + event.type;
      if (this[method]) {
        this[method](event);
      }
    };
    utils.filterFindElements = function(elems, selector) {
      elems = utils.makeArray(elems);
      var ffElems = [];
      for (var i = 0,
          len = elems.length; i < len; i++) {
        var elem = elems[i];
        if (!utils.isElement(elem)) {
          continue;
        }
        if (selector) {
          if (matchesSelector(elem, selector)) {
            ffElems.push(elem);
          }
          var childElems = elem.querySelectorAll(selector);
          for (var j = 0,
              jLen = childElems.length; j < jLen; j++) {
            ffElems.push(childElems[j]);
          }
        } else {
          ffElems.push(elem);
        }
      }
      return ffElems;
    };
    utils.debounceMethod = function(_class, methodName, threshold) {
      var method = _class.prototype[methodName];
      var timeoutName = methodName + 'Timeout';
      _class.prototype[methodName] = function() {
        var timeout = this[timeoutName];
        if (timeout) {
          clearTimeout(timeout);
        }
        var args = arguments;
        var _this = this;
        this[timeoutName] = setTimeout(function() {
          method.apply(_this, args);
          delete _this[timeoutName];
        }, threshold || 100);
      };
    };
    utils.toDashed = function(str) {
      return str.replace(/(.)([A-Z])/g, function(match, $1, $2) {
        return $1 + '-' + $2;
      }).toLowerCase();
    };
    var console = window.console;
    utils.htmlInit = function(WidgetClass, namespace) {
      docReady(function() {
        var dashedNamespace = utils.toDashed(namespace);
        var elems = document.querySelectorAll('.js-' + dashedNamespace);
        var dataAttr = 'data-' + dashedNamespace + '-options';
        for (var i = 0,
            len = elems.length; i < len; i++) {
          var elem = elems[i];
          var attr = elem.getAttribute(dataAttr);
          var options;
          try {
            options = attr && JSON.parse(attr);
          } catch (error) {
            if (console) {
              console.error('Error parsing ' + dataAttr + ' on ' + elem.nodeName.toLowerCase() + (elem.id ? '#' + elem.id : '') + ': ' + error);
            }
            continue;
          }
          var instance = new WidgetClass(elem, options);
          var jQuery = window.jQuery;
          if (jQuery) {
            jQuery.data(elem, namespace, instance);
          }
        }
      });
    };
    return utils;
  }));
  (function(window, factory) {
    if (typeof define === 'function' && define.amd) {
      define('outlayer/item', ['eventEmitter/EventEmitter', 'get-size/get-size', 'get-style-property/get-style-property', 'fizzy-ui-utils/utils'], function(EventEmitter, getSize, getStyleProperty, utils) {
        return factory(window, EventEmitter, getSize, getStyleProperty, utils);
      });
    } else if (typeof exports === 'object') {
      module.exports = factory(window, require('wolfy87-eventemitter'), require('get-size'), require('desandro-get-style-property'), require('fizzy-ui-utils'));
    } else {
      window.Outlayer = {};
      window.Outlayer.Item = factory(window, window.EventEmitter, window.getSize, window.getStyleProperty, window.fizzyUIUtils);
    }
  }(window, function factory(window, EventEmitter, getSize, getStyleProperty, utils) {
    var getComputedStyle = window.getComputedStyle;
    var getStyle = getComputedStyle ? function(elem) {
      return getComputedStyle(elem, null);
    } : function(elem) {
      return elem.currentStyle;
    };
    function isEmptyObj(obj) {
      for (var prop in obj) {
        return false;
      }
      prop = null;
      return true;
    }
    var transitionProperty = getStyleProperty('transition');
    var transformProperty = getStyleProperty('transform');
    var supportsCSS3 = transitionProperty && transformProperty;
    var is3d = !!getStyleProperty('perspective');
    var transitionEndEvent = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'otransitionend',
      transition: 'transitionend'
    }[transitionProperty];
    var prefixableProperties = ['transform', 'transition', 'transitionDuration', 'transitionProperty'];
    var vendorProperties = (function() {
      var cache = {};
      for (var i = 0,
          len = prefixableProperties.length; i < len; i++) {
        var prop = prefixableProperties[i];
        var supportedProp = getStyleProperty(prop);
        if (supportedProp && supportedProp !== prop) {
          cache[prop] = supportedProp;
        }
      }
      return cache;
    })();
    function Item(element, layout) {
      if (!element) {
        return;
      }
      this.element = element;
      this.layout = layout;
      this.position = {
        x: 0,
        y: 0
      };
      this._create();
    }
    utils.extend(Item.prototype, EventEmitter.prototype);
    Item.prototype._create = function() {
      this._transn = {
        ingProperties: {},
        clean: {},
        onEnd: {}
      };
      this.css({position: 'absolute'});
    };
    Item.prototype.handleEvent = function(event) {
      var method = 'on' + event.type;
      if (this[method]) {
        this[method](event);
      }
    };
    Item.prototype.getSize = function() {
      this.size = getSize(this.element);
    };
    Item.prototype.css = function(style) {
      var elemStyle = this.element.style;
      for (var prop in style) {
        var supportedProp = vendorProperties[prop] || prop;
        elemStyle[supportedProp] = style[prop];
      }
    };
    Item.prototype.getPosition = function() {
      var style = getStyle(this.element);
      var layoutOptions = this.layout.options;
      var isOriginLeft = layoutOptions.isOriginLeft;
      var isOriginTop = layoutOptions.isOriginTop;
      var xValue = style[isOriginLeft ? 'left' : 'right'];
      var yValue = style[isOriginTop ? 'top' : 'bottom'];
      var layoutSize = this.layout.size;
      var x = xValue.indexOf('%') != -1 ? (parseFloat(xValue) / 100) * layoutSize.width : parseInt(xValue, 10);
      var y = yValue.indexOf('%') != -1 ? (parseFloat(yValue) / 100) * layoutSize.height : parseInt(yValue, 10);
      x = isNaN(x) ? 0 : x;
      y = isNaN(y) ? 0 : y;
      x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
      y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
      this.position.x = x;
      this.position.y = y;
    };
    Item.prototype.layoutPosition = function() {
      var layoutSize = this.layout.size;
      var layoutOptions = this.layout.options;
      var style = {};
      var xPadding = layoutOptions.isOriginLeft ? 'paddingLeft' : 'paddingRight';
      var xProperty = layoutOptions.isOriginLeft ? 'left' : 'right';
      var xResetProperty = layoutOptions.isOriginLeft ? 'right' : 'left';
      var x = this.position.x + layoutSize[xPadding];
      style[xProperty] = this.getXValue(x);
      style[xResetProperty] = '';
      var yPadding = layoutOptions.isOriginTop ? 'paddingTop' : 'paddingBottom';
      var yProperty = layoutOptions.isOriginTop ? 'top' : 'bottom';
      var yResetProperty = layoutOptions.isOriginTop ? 'bottom' : 'top';
      var y = this.position.y + layoutSize[yPadding];
      style[yProperty] = this.getYValue(y);
      style[yResetProperty] = '';
      this.css(style);
      this.emitEvent('layout', [this]);
    };
    Item.prototype.getXValue = function(x) {
      var layoutOptions = this.layout.options;
      return layoutOptions.percentPosition && !layoutOptions.isHorizontal ? ((x / this.layout.size.width) * 100) + '%' : x + 'px';
    };
    Item.prototype.getYValue = function(y) {
      var layoutOptions = this.layout.options;
      return layoutOptions.percentPosition && layoutOptions.isHorizontal ? ((y / this.layout.size.height) * 100) + '%' : y + 'px';
    };
    Item.prototype._transitionTo = function(x, y) {
      this.getPosition();
      var curX = this.position.x;
      var curY = this.position.y;
      var compareX = parseInt(x, 10);
      var compareY = parseInt(y, 10);
      var didNotMove = compareX === this.position.x && compareY === this.position.y;
      this.setPosition(x, y);
      if (didNotMove && !this.isTransitioning) {
        this.layoutPosition();
        return;
      }
      var transX = x - curX;
      var transY = y - curY;
      var transitionStyle = {};
      transitionStyle.transform = this.getTranslate(transX, transY);
      this.transition({
        to: transitionStyle,
        onTransitionEnd: {transform: this.layoutPosition},
        isCleaning: true
      });
    };
    Item.prototype.getTranslate = function(x, y) {
      var layoutOptions = this.layout.options;
      x = layoutOptions.isOriginLeft ? x : -x;
      y = layoutOptions.isOriginTop ? y : -y;
      if (is3d) {
        return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      }
      return 'translate(' + x + 'px, ' + y + 'px)';
    };
    Item.prototype.goTo = function(x, y) {
      this.setPosition(x, y);
      this.layoutPosition();
    };
    Item.prototype.moveTo = supportsCSS3 ? Item.prototype._transitionTo : Item.prototype.goTo;
    Item.prototype.setPosition = function(x, y) {
      this.position.x = parseInt(x, 10);
      this.position.y = parseInt(y, 10);
    };
    Item.prototype._nonTransition = function(args) {
      this.css(args.to);
      if (args.isCleaning) {
        this._removeStyles(args.to);
      }
      for (var prop in args.onTransitionEnd) {
        args.onTransitionEnd[prop].call(this);
      }
    };
    Item.prototype._transition = function(args) {
      if (!parseFloat(this.layout.options.transitionDuration)) {
        this._nonTransition(args);
        return;
      }
      var _transition = this._transn;
      for (var prop in args.onTransitionEnd) {
        _transition.onEnd[prop] = args.onTransitionEnd[prop];
      }
      for (prop in args.to) {
        _transition.ingProperties[prop] = true;
        if (args.isCleaning) {
          _transition.clean[prop] = true;
        }
      }
      if (args.from) {
        this.css(args.from);
        var h = this.element.offsetHeight;
        h = null;
      }
      this.enableTransition(args.to);
      this.css(args.to);
      this.isTransitioning = true;
    };
    function toDashedAll(str) {
      return str.replace(/([A-Z])/g, function($1) {
        return '-' + $1.toLowerCase();
      });
    }
    var transitionProps = 'opacity,' + toDashedAll(vendorProperties.transform || 'transform');
    Item.prototype.enableTransition = function() {
      if (this.isTransitioning) {
        return;
      }
      this.css({
        transitionProperty: transitionProps,
        transitionDuration: this.layout.options.transitionDuration
      });
      this.element.addEventListener(transitionEndEvent, this, false);
    };
    Item.prototype.transition = Item.prototype[transitionProperty ? '_transition' : '_nonTransition'];
    Item.prototype.onwebkitTransitionEnd = function(event) {
      this.ontransitionend(event);
    };
    Item.prototype.onotransitionend = function(event) {
      this.ontransitionend(event);
    };
    var dashedVendorProperties = {
      '-webkit-transform': 'transform',
      '-moz-transform': 'transform',
      '-o-transform': 'transform'
    };
    Item.prototype.ontransitionend = function(event) {
      if (event.target !== this.element) {
        return;
      }
      var _transition = this._transn;
      var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;
      delete _transition.ingProperties[propertyName];
      if (isEmptyObj(_transition.ingProperties)) {
        this.disableTransition();
      }
      if (propertyName in _transition.clean) {
        this.element.style[event.propertyName] = '';
        delete _transition.clean[propertyName];
      }
      if (propertyName in _transition.onEnd) {
        var onTransitionEnd = _transition.onEnd[propertyName];
        onTransitionEnd.call(this);
        delete _transition.onEnd[propertyName];
      }
      this.emitEvent('transitionEnd', [this]);
    };
    Item.prototype.disableTransition = function() {
      this.removeTransitionStyles();
      this.element.removeEventListener(transitionEndEvent, this, false);
      this.isTransitioning = false;
    };
    Item.prototype._removeStyles = function(style) {
      var cleanStyle = {};
      for (var prop in style) {
        cleanStyle[prop] = '';
      }
      this.css(cleanStyle);
    };
    var cleanTransitionStyle = {
      transitionProperty: '',
      transitionDuration: ''
    };
    Item.prototype.removeTransitionStyles = function() {
      this.css(cleanTransitionStyle);
    };
    Item.prototype.removeElem = function() {
      this.element.parentNode.removeChild(this.element);
      this.css({display: ''});
      this.emitEvent('remove', [this]);
    };
    Item.prototype.remove = function() {
      if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {
        this.removeElem();
        return;
      }
      var _this = this;
      this.once('transitionEnd', function() {
        _this.removeElem();
      });
      this.hide();
    };
    Item.prototype.reveal = function() {
      delete this.isHidden;
      this.css({display: ''});
      var options = this.layout.options;
      var onTransitionEnd = {};
      var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
      onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;
      this.transition({
        from: options.hiddenStyle,
        to: options.visibleStyle,
        isCleaning: true,
        onTransitionEnd: onTransitionEnd
      });
    };
    Item.prototype.onRevealTransitionEnd = function() {
      if (!this.isHidden) {
        this.emitEvent('reveal');
      }
    };
    Item.prototype.getHideRevealTransitionEndProperty = function(styleProperty) {
      var optionStyle = this.layout.options[styleProperty];
      if (optionStyle.opacity) {
        return 'opacity';
      }
      for (var prop in optionStyle) {
        return prop;
      }
    };
    Item.prototype.hide = function() {
      this.isHidden = true;
      this.css({display: ''});
      var options = this.layout.options;
      var onTransitionEnd = {};
      var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
      onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;
      this.transition({
        from: options.visibleStyle,
        to: options.hiddenStyle,
        isCleaning: true,
        onTransitionEnd: onTransitionEnd
      });
    };
    Item.prototype.onHideTransitionEnd = function() {
      if (this.isHidden) {
        this.css({display: 'none'});
        this.emitEvent('hide');
      }
    };
    Item.prototype.destroy = function() {
      this.css({
        position: '',
        left: '',
        right: '',
        top: '',
        bottom: '',
        transition: '',
        transform: ''
      });
    };
    return Item;
  }));
  (function(window, factory) {
    if (typeof define == 'function' && define.amd) {
      define('outlayer/outlayer', ['eventie/eventie', 'eventEmitter/EventEmitter', 'get-size/get-size', 'fizzy-ui-utils/utils', './item'], function(eventie, EventEmitter, getSize, utils, Item) {
        return factory(window, eventie, EventEmitter, getSize, utils, Item);
      });
    } else if (typeof exports == 'object') {
      module.exports = factory(window, require('eventie'), require('wolfy87-eventemitter'), require('get-size'), require('fizzy-ui-utils'), require('./item'));
    } else {
      window.Outlayer = factory(window, window.eventie, window.EventEmitter, window.getSize, window.fizzyUIUtils, window.Outlayer.Item);
    }
  }(window, function factory(window, eventie, EventEmitter, getSize, utils, Item) {
    var console = window.console;
    var jQuery = window.jQuery;
    var noop = function() {};
    var GUID = 0;
    var instances = {};
    function Outlayer(element, options) {
      var queryElement = utils.getQueryElement(element);
      if (!queryElement) {
        if (console) {
          console.error('Bad element for ' + this.constructor.namespace + ': ' + (queryElement || element));
        }
        return;
      }
      this.element = queryElement;
      if (jQuery) {
        this.$element = jQuery(this.element);
      }
      this.options = utils.extend({}, this.constructor.defaults);
      this.option(options);
      var id = ++GUID;
      this.element.outlayerGUID = id;
      instances[id] = this;
      this._create();
      if (this.options.isInitLayout) {
        this.layout();
      }
    }
    Outlayer.namespace = 'outlayer';
    Outlayer.Item = Item;
    Outlayer.defaults = {
      containerStyle: {position: 'relative'},
      isInitLayout: true,
      isOriginLeft: true,
      isOriginTop: true,
      isResizeBound: true,
      isResizingContainer: true,
      transitionDuration: '0.4s',
      hiddenStyle: {
        opacity: 0,
        transform: 'scale(0.001)'
      },
      visibleStyle: {
        opacity: 1,
        transform: 'scale(1)'
      }
    };
    utils.extend(Outlayer.prototype, EventEmitter.prototype);
    Outlayer.prototype.option = function(opts) {
      utils.extend(this.options, opts);
    };
    Outlayer.prototype._create = function() {
      this.reloadItems();
      this.stamps = [];
      this.stamp(this.options.stamp);
      utils.extend(this.element.style, this.options.containerStyle);
      if (this.options.isResizeBound) {
        this.bindResize();
      }
    };
    Outlayer.prototype.reloadItems = function() {
      this.items = this._itemize(this.element.children);
    };
    Outlayer.prototype._itemize = function(elems) {
      var itemElems = this._filterFindItemElements(elems);
      var Item = this.constructor.Item;
      var items = [];
      for (var i = 0,
          len = itemElems.length; i < len; i++) {
        var elem = itemElems[i];
        var item = new Item(elem, this);
        items.push(item);
      }
      return items;
    };
    Outlayer.prototype._filterFindItemElements = function(elems) {
      return utils.filterFindElements(elems, this.options.itemSelector);
    };
    Outlayer.prototype.getItemElements = function() {
      var elems = [];
      for (var i = 0,
          len = this.items.length; i < len; i++) {
        elems.push(this.items[i].element);
      }
      return elems;
    };
    Outlayer.prototype.layout = function() {
      this._resetLayout();
      this._manageStamps();
      var isInstant = this.options.isLayoutInstant !== undefined ? this.options.isLayoutInstant : !this._isLayoutInited;
      this.layoutItems(this.items, isInstant);
      this._isLayoutInited = true;
    };
    Outlayer.prototype._init = Outlayer.prototype.layout;
    Outlayer.prototype._resetLayout = function() {
      this.getSize();
    };
    Outlayer.prototype.getSize = function() {
      this.size = getSize(this.element);
    };
    Outlayer.prototype._getMeasurement = function(measurement, size) {
      var option = this.options[measurement];
      var elem;
      if (!option) {
        this[measurement] = 0;
      } else {
        if (typeof option === 'string') {
          elem = this.element.querySelector(option);
        } else if (utils.isElement(option)) {
          elem = option;
        }
        this[measurement] = elem ? getSize(elem)[size] : option;
      }
    };
    Outlayer.prototype.layoutItems = function(items, isInstant) {
      items = this._getItemsForLayout(items);
      this._layoutItems(items, isInstant);
      this._postLayout();
    };
    Outlayer.prototype._getItemsForLayout = function(items) {
      var layoutItems = [];
      for (var i = 0,
          len = items.length; i < len; i++) {
        var item = items[i];
        if (!item.isIgnored) {
          layoutItems.push(item);
        }
      }
      return layoutItems;
    };
    Outlayer.prototype._layoutItems = function(items, isInstant) {
      this._emitCompleteOnItems('layout', items);
      if (!items || !items.length) {
        return;
      }
      var queue = [];
      for (var i = 0,
          len = items.length; i < len; i++) {
        var item = items[i];
        var position = this._getItemLayoutPosition(item);
        position.item = item;
        position.isInstant = isInstant || item.isLayoutInstant;
        queue.push(position);
      }
      this._processLayoutQueue(queue);
    };
    Outlayer.prototype._getItemLayoutPosition = function() {
      return {
        x: 0,
        y: 0
      };
    };
    Outlayer.prototype._processLayoutQueue = function(queue) {
      for (var i = 0,
          len = queue.length; i < len; i++) {
        var obj = queue[i];
        this._positionItem(obj.item, obj.x, obj.y, obj.isInstant);
      }
    };
    Outlayer.prototype._positionItem = function(item, x, y, isInstant) {
      if (isInstant) {
        item.goTo(x, y);
      } else {
        item.moveTo(x, y);
      }
    };
    Outlayer.prototype._postLayout = function() {
      this.resizeContainer();
    };
    Outlayer.prototype.resizeContainer = function() {
      if (!this.options.isResizingContainer) {
        return;
      }
      var size = this._getContainerSize();
      if (size) {
        this._setContainerMeasure(size.width, true);
        this._setContainerMeasure(size.height, false);
      }
    };
    Outlayer.prototype._getContainerSize = noop;
    Outlayer.prototype._setContainerMeasure = function(measure, isWidth) {
      if (measure === undefined) {
        return;
      }
      var elemSize = this.size;
      if (elemSize.isBorderBox) {
        measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight + elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop + elemSize.borderTopWidth + elemSize.borderBottomWidth;
      }
      measure = Math.max(measure, 0);
      this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
    };
    Outlayer.prototype._emitCompleteOnItems = function(eventName, items) {
      var _this = this;
      function onComplete() {
        _this.dispatchEvent(eventName + 'Complete', null, [items]);
      }
      var count = items.length;
      if (!items || !count) {
        onComplete();
        return;
      }
      var doneCount = 0;
      function tick() {
        doneCount++;
        if (doneCount === count) {
          onComplete();
        }
      }
      for (var i = 0,
          len = items.length; i < len; i++) {
        var item = items[i];
        item.once(eventName, tick);
      }
    };
    Outlayer.prototype.dispatchEvent = function(type, event, args) {
      var emitArgs = event ? [event].concat(args) : args;
      this.emitEvent(type, emitArgs);
      if (jQuery) {
        this.$element = this.$element || jQuery(this.element);
        if (event) {
          var $event = jQuery.Event(event);
          $event.type = type;
          this.$element.trigger($event, args);
        } else {
          this.$element.trigger(type, args);
        }
      }
    };
    Outlayer.prototype.ignore = function(elem) {
      var item = this.getItem(elem);
      if (item) {
        item.isIgnored = true;
      }
    };
    Outlayer.prototype.unignore = function(elem) {
      var item = this.getItem(elem);
      if (item) {
        delete item.isIgnored;
      }
    };
    Outlayer.prototype.stamp = function(elems) {
      elems = this._find(elems);
      if (!elems) {
        return;
      }
      this.stamps = this.stamps.concat(elems);
      for (var i = 0,
          len = elems.length; i < len; i++) {
        var elem = elems[i];
        this.ignore(elem);
      }
    };
    Outlayer.prototype.unstamp = function(elems) {
      elems = this._find(elems);
      if (!elems) {
        return;
      }
      for (var i = 0,
          len = elems.length; i < len; i++) {
        var elem = elems[i];
        utils.removeFrom(this.stamps, elem);
        this.unignore(elem);
      }
    };
    Outlayer.prototype._find = function(elems) {
      if (!elems) {
        return;
      }
      if (typeof elems === 'string') {
        elems = this.element.querySelectorAll(elems);
      }
      elems = utils.makeArray(elems);
      return elems;
    };
    Outlayer.prototype._manageStamps = function() {
      if (!this.stamps || !this.stamps.length) {
        return;
      }
      this._getBoundingRect();
      for (var i = 0,
          len = this.stamps.length; i < len; i++) {
        var stamp = this.stamps[i];
        this._manageStamp(stamp);
      }
    };
    Outlayer.prototype._getBoundingRect = function() {
      var boundingRect = this.element.getBoundingClientRect();
      var size = this.size;
      this._boundingRect = {
        left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
        top: boundingRect.top + size.paddingTop + size.borderTopWidth,
        right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
        bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)
      };
    };
    Outlayer.prototype._manageStamp = noop;
    Outlayer.prototype._getElementOffset = function(elem) {
      var boundingRect = elem.getBoundingClientRect();
      var thisRect = this._boundingRect;
      var size = getSize(elem);
      var offset = {
        left: boundingRect.left - thisRect.left - size.marginLeft,
        top: boundingRect.top - thisRect.top - size.marginTop,
        right: thisRect.right - boundingRect.right - size.marginRight,
        bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
      };
      return offset;
    };
    Outlayer.prototype.handleEvent = function(event) {
      var method = 'on' + event.type;
      if (this[method]) {
        this[method](event);
      }
    };
    Outlayer.prototype.bindResize = function() {
      if (this.isResizeBound) {
        return;
      }
      eventie.bind(window, 'resize', this);
      this.isResizeBound = true;
    };
    Outlayer.prototype.unbindResize = function() {
      if (this.isResizeBound) {
        eventie.unbind(window, 'resize', this);
      }
      this.isResizeBound = false;
    };
    Outlayer.prototype.onresize = function() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      var _this = this;
      function delayed() {
        _this.resize();
        delete _this.resizeTimeout;
      }
      this.resizeTimeout = setTimeout(delayed, 100);
    };
    Outlayer.prototype.resize = function() {
      if (!this.isResizeBound || !this.needsResizeLayout()) {
        return;
      }
      this.layout();
    };
    Outlayer.prototype.needsResizeLayout = function() {
      var size = getSize(this.element);
      var hasSizes = this.size && size;
      return hasSizes && size.innerWidth !== this.size.innerWidth;
    };
    Outlayer.prototype.addItems = function(elems) {
      var items = this._itemize(elems);
      if (items.length) {
        this.items = this.items.concat(items);
      }
      return items;
    };
    Outlayer.prototype.appended = function(elems) {
      var items = this.addItems(elems);
      if (!items.length) {
        return;
      }
      this.layoutItems(items, true);
      this.reveal(items);
    };
    Outlayer.prototype.prepended = function(elems) {
      var items = this._itemize(elems);
      if (!items.length) {
        return;
      }
      var previousItems = this.items.slice(0);
      this.items = items.concat(previousItems);
      this._resetLayout();
      this._manageStamps();
      this.layoutItems(items, true);
      this.reveal(items);
      this.layoutItems(previousItems);
    };
    Outlayer.prototype.reveal = function(items) {
      this._emitCompleteOnItems('reveal', items);
      var len = items && items.length;
      for (var i = 0; len && i < len; i++) {
        var item = items[i];
        item.reveal();
      }
    };
    Outlayer.prototype.hide = function(items) {
      this._emitCompleteOnItems('hide', items);
      var len = items && items.length;
      for (var i = 0; len && i < len; i++) {
        var item = items[i];
        item.hide();
      }
    };
    Outlayer.prototype.revealItemElements = function(elems) {
      var items = this.getItems(elems);
      this.reveal(items);
    };
    Outlayer.prototype.hideItemElements = function(elems) {
      var items = this.getItems(elems);
      this.hide(items);
    };
    Outlayer.prototype.getItem = function(elem) {
      for (var i = 0,
          len = this.items.length; i < len; i++) {
        var item = this.items[i];
        if (item.element === elem) {
          return item;
        }
      }
    };
    Outlayer.prototype.getItems = function(elems) {
      elems = utils.makeArray(elems);
      var items = [];
      for (var i = 0,
          len = elems.length; i < len; i++) {
        var elem = elems[i];
        var item = this.getItem(elem);
        if (item) {
          items.push(item);
        }
      }
      return items;
    };
    Outlayer.prototype.remove = function(elems) {
      var removeItems = this.getItems(elems);
      this._emitCompleteOnItems('remove', removeItems);
      if (!removeItems || !removeItems.length) {
        return;
      }
      for (var i = 0,
          len = removeItems.length; i < len; i++) {
        var item = removeItems[i];
        item.remove();
        utils.removeFrom(this.items, item);
      }
    };
    Outlayer.prototype.destroy = function() {
      var style = this.element.style;
      style.height = '';
      style.position = '';
      style.width = '';
      for (var i = 0,
          len = this.items.length; i < len; i++) {
        var item = this.items[i];
        item.destroy();
      }
      this.unbindResize();
      var id = this.element.outlayerGUID;
      delete instances[id];
      delete this.element.outlayerGUID;
      if (jQuery) {
        jQuery.removeData(this.element, this.constructor.namespace);
      }
    };
    Outlayer.data = function(elem) {
      elem = utils.getQueryElement(elem);
      var id = elem && elem.outlayerGUID;
      return id && instances[id];
    };
    Outlayer.create = function(namespace, options) {
      function Layout() {
        Outlayer.apply(this, arguments);
      }
      if (Object.create) {
        Layout.prototype = Object.create(Outlayer.prototype);
      } else {
        utils.extend(Layout.prototype, Outlayer.prototype);
      }
      Layout.prototype.constructor = Layout;
      Layout.defaults = utils.extend({}, Outlayer.defaults);
      utils.extend(Layout.defaults, options);
      Layout.prototype.settings = {};
      Layout.namespace = namespace;
      Layout.data = Outlayer.data;
      Layout.Item = function LayoutItem() {
        Item.apply(this, arguments);
      };
      Layout.Item.prototype = new Item();
      utils.htmlInit(Layout, namespace);
      if (jQuery && jQuery.bridget) {
        jQuery.bridget(namespace, Layout);
      }
      return Layout;
    };
    Outlayer.Item = Item;
    return Outlayer;
  }));
  (function(window, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['outlayer/outlayer', 'get-size/get-size', 'fizzy-ui-utils/utils'], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory(require('outlayer'), require('get-size'), require('fizzy-ui-utils'));
    } else {
      window.Masonry = factory(window.Outlayer, window.getSize, window.fizzyUIUtils);
    }
  }(window, function factory(Outlayer, getSize, utils) {
    var Masonry = Outlayer.create('masonry');
    Masonry.prototype._resetLayout = function() {
      this.getSize();
      this._getMeasurement('columnWidth', 'outerWidth');
      this._getMeasurement('gutter', 'outerWidth');
      this.measureColumns();
      var i = this.cols;
      this.colYs = [];
      while (i--) {
        this.colYs.push(0);
      }
      this.maxY = 0;
    };
    Masonry.prototype.measureColumns = function() {
      this.getContainerWidth();
      if (!this.columnWidth) {
        var firstItem = this.items[0];
        var firstItemElem = firstItem && firstItem.element;
        this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth || this.containerWidth;
      }
      var columnWidth = this.columnWidth += this.gutter;
      var containerWidth = this.containerWidth + this.gutter;
      var cols = containerWidth / columnWidth;
      var excess = columnWidth - containerWidth % columnWidth;
      var mathMethod = excess && excess < 1 ? 'round' : 'floor';
      cols = Math[mathMethod](cols);
      this.cols = Math.max(cols, 1);
    };
    Masonry.prototype.getContainerWidth = function() {
      var container = this.options.isFitWidth ? this.element.parentNode : this.element;
      var size = getSize(container);
      this.containerWidth = size && size.innerWidth;
    };
    Masonry.prototype._getItemLayoutPosition = function(item) {
      item.getSize();
      var remainder = item.size.outerWidth % this.columnWidth;
      var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
      var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
      colSpan = Math.min(colSpan, this.cols);
      var colGroup = this._getColGroup(colSpan);
      var minimumY = Math.min.apply(Math, colGroup);
      var shortColIndex = utils.indexOf(colGroup, minimumY);
      var position = {
        x: this.columnWidth * shortColIndex,
        y: minimumY
      };
      var setHeight = minimumY + item.size.outerHeight;
      var setSpan = this.cols + 1 - colGroup.length;
      for (var i = 0; i < setSpan; i++) {
        this.colYs[shortColIndex + i] = setHeight;
      }
      return position;
    };
    Masonry.prototype._getColGroup = function(colSpan) {
      if (colSpan < 2) {
        return this.colYs;
      }
      var colGroup = [];
      var groupCount = this.cols + 1 - colSpan;
      for (var i = 0; i < groupCount; i++) {
        var groupColYs = this.colYs.slice(i, i + colSpan);
        colGroup[i] = Math.max.apply(Math, groupColYs);
      }
      return colGroup;
    };
    Masonry.prototype._manageStamp = function(stamp) {
      var stampSize = getSize(stamp);
      var offset = this._getElementOffset(stamp);
      var firstX = this.options.isOriginLeft ? offset.left : offset.right;
      var lastX = firstX + stampSize.outerWidth;
      var firstCol = Math.floor(firstX / this.columnWidth);
      firstCol = Math.max(0, firstCol);
      var lastCol = Math.floor(lastX / this.columnWidth);
      lastCol -= lastX % this.columnWidth ? 0 : 1;
      lastCol = Math.min(this.cols - 1, lastCol);
      var stampMaxY = (this.options.isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
      for (var i = firstCol; i <= lastCol; i++) {
        this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
      }
    };
    Masonry.prototype._getContainerSize = function() {
      this.maxY = Math.max.apply(Math, this.colYs);
      var size = {height: this.maxY};
      if (this.options.isFitWidth) {
        size.width = this._getContainerFitWidth();
      }
      return size;
    };
    Masonry.prototype._getContainerFitWidth = function() {
      var unusedCols = 0;
      var i = this.cols;
      while (--i) {
        if (this.colYs[i] !== 0) {
          break;
        }
        unusedCols++;
      }
      return (this.cols - unusedCols) * this.columnWidth - this.gutter;
    };
    Masonry.prototype.needsResizeLayout = function() {
      var previousWidth = this.containerWidth;
      this.getContainerWidth();
      return previousWidth !== this.containerWidth;
    };
    return Masonry;
  }));
})(require('process'));

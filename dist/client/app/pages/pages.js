System.register([], function (_export) {
    "use strict";

    return {
        setters: [],
        execute: function () {
            (function ($) {

                'use strict';

                var Pages = function Pages() {
                    this.VERSION = "2.0.0";
                    this.AUTHOR = "Revox";
                    this.SUPPORT = "support@revox.io";

                    this.pageScrollElement = 'html, body';
                    this.$body = $('body');

                    this.setUserOS();
                    this.setUserAgent();
                };

                Pages.prototype.setUserOS = function () {
                    var OSName = "";
                    if (navigator.appVersion.indexOf("Win") != -1) OSName = "windows";
                    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "mac";
                    if (navigator.appVersion.indexOf("X11") != -1) OSName = "unix";
                    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "linux";

                    this.$body.addClass(OSName);
                };

                Pages.prototype.setUserAgent = function () {
                    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
                        this.$body.addClass('mobile');
                    } else {
                        this.$body.addClass('desktop');
                        if (navigator.userAgent.match(/MSIE 9.0/)) {
                            this.$body.addClass('ie9');
                        }
                    }
                };

                Pages.prototype.isVisibleXs = function () {
                    !$('#pg-visible-xs').length && this.$body.append('<div id="pg-visible-xs" class="visible-xs" />');
                    return $('#pg-visible-xs').is(':visible');
                };

                Pages.prototype.isVisibleSm = function () {
                    !$('#pg-visible-sm').length && this.$body.append('<div id="pg-visible-sm" class="visible-sm" />');
                    return $('#pg-visible-sm').is(':visible');
                };

                Pages.prototype.isVisibleMd = function () {
                    !$('#pg-visible-md').length && this.$body.append('<div id="pg-visible-md" class="visible-md" />');
                    return $('#pg-visible-md').is(':visible');
                };

                Pages.prototype.isVisibleLg = function () {
                    !$('#pg-visible-lg').length && this.$body.append('<div id="pg-visible-lg" class="visible-lg" />');
                    return $('#pg-visible-lg').is(':visible');
                };

                Pages.prototype.getUserAgent = function () {
                    return $('body').hasClass('mobile') ? "mobile" : "desktop";
                };

                Pages.prototype.setFullScreen = function (element) {
                    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;

                    if (requestMethod) {
                        requestMethod.call(element);
                    } else if (typeof window.ActiveXObject !== "undefined") {
                        var wscript = new ActiveXObject("WScript.Shell");
                        if (wscript !== null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                };

                Pages.prototype.getColor = function (color, opacity) {
                    opacity = parseFloat(opacity) || 1;

                    var elem = $('.pg-colors').length ? $('.pg-colors') : $('<div class="pg-colors"></div>').appendTo('body');

                    var colorElem = elem.find('[data-color="' + color + '"]').length ? elem.find('[data-color="' + color + '"]') : $('<div class="bg-' + color + '" data-color="' + color + '"></div>').appendTo(elem);

                    var color = colorElem.css('background-color');

                    var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    var rgba = "rgba(" + rgb[1] + ", " + rgb[2] + ", " + rgb[3] + ', ' + opacity + ')';

                    return rgba;
                };

                Pages.prototype.initSidebar = function () {
                    $('[data-pages="sidebar"]').each(function () {
                        var $sidebar = $(this);
                        $sidebar.sidebar($sidebar.data());
                    });
                };

                Pages.prototype.initDropDown = function () {
                    $('.dropdown-default').each(function () {
                        var btn = $(this).find('.dropdown-menu').siblings('.dropdown-toggle');
                        var offset = 0;

                        var padding = btn.actual('innerWidth') - btn.actual('width');
                        var menuWidth = $(this).find('.dropdown-menu').actual('outerWidth');

                        if (btn.actual('outerWidth') < menuWidth) {
                            btn.width(menuWidth - offset);
                            $(this).find('.dropdown-menu').width(btn.actual('outerWidth'));
                        } else {
                            $(this).find('.dropdown-menu').width(btn.actual('outerWidth'));
                        }
                    });
                };

                Pages.prototype.initFormGroupDefault = function () {
                    $('.form-group.form-group-default').click(function () {
                        $(this).find('input').focus();
                    });
                    $('body').on('focus', '.form-group.form-group-default :input', function () {
                        $('.form-group.form-group-default').removeClass('focused');
                        $(this).parents('.form-group').addClass('focused');
                    });

                    $('body').on('blur', '.form-group.form-group-default :input', function () {
                        $(this).parents('.form-group').removeClass('focused');
                        if ($(this).val()) {
                            $(this).closest('.form-group').find('label').addClass('fade');
                        } else {
                            $(this).closest('.form-group').find('label').removeClass('fade');
                        }
                    });

                    $('.form-group.form-group-default .checkbox, .form-group.form-group-default .radio').hover(function () {
                        $(this).parents('.form-group').addClass('focused');
                    }, function () {
                        $(this).parents('.form-group').removeClass('focused');
                    });
                };

                Pages.prototype.initSlidingTabs = function () {
                    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
                        e = $(e.target).parent().find('a[data-toggle=tab]');

                        var hrefPrev = e.attr('href');

                        var hrefCurrent = e.attr('href');

                        if (!$(hrefCurrent).is('.slide-left, .slide-right')) return;
                        $(hrefCurrent).addClass('sliding');

                        setTimeout(function () {
                            $(hrefCurrent).removeClass('sliding');
                        }, 100);
                    });
                };

                Pages.prototype.initNotificationCenter = function () {
                    $('.notification-list .dropdown-menu').on('click', function (event) {
                        event.stopPropagation();
                    });
                    $('.toggle-more-details').on('click', function (event) {
                        var p = $(this).closest('.heading');
                        p.closest('.heading').children('.more-details').stop().slideToggle('fast', function () {
                            p.toggleClass('open');
                        });
                    });
                };

                Pages.prototype.initProgressBars = function () {
                    $(window).on('load', function () {
                        $('.progress-bar-indeterminate, .progress-circle-indeterminate, .mapplic-pin').hide().show(0);
                    });
                };

                Pages.prototype.initView = function () {
                    $('[data-navigate="view"]').on('click', function (e) {
                        e.preventDefault();
                        var el = $(this).attr('data-view-port');
                        if ($(this).attr('data-toggle-view') != null) {
                            $(el).children().last().children('.view').hide();
                            $($(this).attr('data-toggle-view')).show();
                        }
                        $(el).toggleClass($(this).attr('data-view-animation'));
                        return false;
                    });
                };

                Pages.prototype.initInputFile = function () {
                    $(document).on('change', '.btn-file :file', function () {
                        var input = $(this),
                            numFiles = input.get(0).files ? input.get(0).files.length : 1,
                            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                        input.trigger('fileselect', [numFiles, label]);
                    });

                    $('.btn-file :file').on('fileselect', function (event, numFiles, label) {
                        var input = $(this).parents('.input-group').find(':text'),
                            log = numFiles > 1 ? numFiles + ' files selected' : label;
                        if (input.length) {
                            input.val(log);
                        } else {
                            $(this).parent().html(log);
                        }
                    });
                };

                Pages.prototype.initTooltipPlugin = function () {
                    $.fn.tooltip && $('[data-toggle="tooltip"]').tooltip();
                };

                Pages.prototype.initSelect2Plugin = function () {
                    $.fn.select2 && $('[data-init-plugin="select2"]').each(function () {
                        $(this).select2({
                            minimumResultsForSearch: $(this).attr('data-disable-search') == 'true' ? -1 : 1
                        }).on('select2-opening', function () {
                            $.fn.scrollbar && $('.select2-results').scrollbar({
                                ignoreMobile: false
                            });
                        });
                    });
                };

                Pages.prototype.initScrollBarPlugin = function () {
                    $.fn.scrollbar && $('.scrollable').scrollbar({
                        ignoreOverlay: false
                    });
                };

                Pages.prototype.initSwitcheryPlugin = function () {
                    window.Switchery && $('[data-init-plugin="switchery"]').each(function () {
                        new Switchery($(this).get(0), {
                            color: $.Pages.getColor('success')
                        });
                    });
                };

                Pages.prototype.initSelectFxPlugin = function () {
                    window.SelectFx && $('select[data-init-plugin="cs-select"]').each(function () {
                        var el = $(this).get(0);
                        $(el).wrap('<div class="cs-wrapper"></div>');
                        new SelectFx(el);
                    });
                };

                Pages.prototype.initUnveilPlugin = function () {
                    $.fn.unveil && $("img").unveil();
                };

                Pages.prototype.initValidatorPlugin = function () {
                    $.validator && $.validator.setDefaults({
                        ignore: "",
                        showErrors: function showErrors(errorMap, errorList) {
                            var $this = this;
                            $.each(this.successList, function (index, value) {
                                var parent = $(this).closest('.form-group-attached');
                                if (parent.length) return $(value).popover("hide");
                            });
                            return $.each(errorList, function (index, value) {

                                var parent = $(value.element).closest('.form-group-attached');
                                if (!parent.length) {
                                    return $this.defaultShowErrors();
                                }
                                var _popover;
                                _popover = $(value.element).popover({
                                    trigger: "manual",
                                    placement: "top",
                                    html: true,
                                    container: parent.closest('form'),
                                    content: value.message
                                });
                                _popover.data("bs.popover").options.content = value.message;
                                var parent = $(value.element).closest('.form-group');
                                parent.addClass('has-error');
                                $(value.element).popover("show");
                            });
                        },
                        onfocusout: function onfocusout(element) {
                            var parent = $(element).closest('.form-group');
                            if ($(element).valid()) {
                                parent.removeClass('has-error');
                                parent.next('.error').remove();
                            }
                        },
                        onkeyup: function onkeyup(element) {
                            var parent = $(element).closest('.form-group');
                            if ($(element).valid()) {
                                $(element).removeClass('error');
                                parent.removeClass('has-error');
                                parent.next('label.error').remove();
                                parent.find('label.error').remove();
                            } else {
                                parent.addClass('has-error');
                            }
                        },
                        errorPlacement: function errorPlacement(error, element) {
                            var parent = $(element).closest('.form-group');
                            if (parent.hasClass('form-group-default')) {
                                parent.addClass('has-error');
                                error.insertAfter(parent);
                            } else {
                                error.insertAfter(element);
                            }
                        }
                    });
                };

                Pages.prototype.init = function () {
                    this.initSidebar();
                    this.initDropDown();
                    this.initFormGroupDefault();
                    this.initSlidingTabs();
                    this.initNotificationCenter();
                    this.initProgressBars();

                    this.initTooltipPlugin();
                    this.initSelect2Plugin();
                    this.initScrollBarPlugin();
                    this.initSwitcheryPlugin();
                    this.initSelectFxPlugin();
                    this.initUnveilPlugin();
                    this.initValidatorPlugin();
                    this.initView();
                    this.initInputFile();
                };

                $.Pages = new Pages();
                $.Pages.Constructor = Pages;
            })(window.jQuery);

            ;
            (function (window) {

                'use strict';

                function hasParent(e, p) {
                    if (!e) return false;
                    var el = e.target || e.srcElement || e || false;
                    while (el && el != p) {
                        el = el.parentNode || false;
                    }
                    return el !== false;
                };

                function extend(a, b) {
                    for (var key in b) {
                        if (b.hasOwnProperty(key)) {
                            a[key] = b[key];
                        }
                    }
                    return a;
                }

                function SelectFx(el, options) {
                    this.el = el;
                    this.options = extend({}, this.options);
                    extend(this.options, options);
                    this._init();
                }

                function closest(elem, selector) {
                    var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
                    while (elem) {
                        if (matchesSelector.bind(elem)(selector)) {
                            return elem;
                        } else {
                            elem = elem.parentElement;
                        }
                    }
                    return false;
                }

                function offset(el) {
                    return {
                        left: el.getBoundingClientRect().left + window.pageXOffset - el.ownerDocument.documentElement.clientLeft,
                        top: el.getBoundingClientRect().top + window.pageYOffset - el.ownerDocument.documentElement.clientTop
                    };
                }

                function insertAfter(newNode, referenceNode) {
                    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                }

                SelectFx.prototype.options = {
                    newTab: true,

                    stickyPlaceholder: true,

                    container: 'body',

                    onChange: function onChange(el) {
                        console.log(el);
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent('change', true, false);
                        el.dispatchEvent(event);
                    }
                };

                SelectFx.prototype._init = function () {
                    var selectedOpt = this.el.querySelector('option[selected]');
                    this.hasDefaultPlaceholder = selectedOpt && selectedOpt.disabled;

                    this.selectedOpt = selectedOpt || this.el.querySelector('option');

                    this._createSelectEl();

                    this.selOpts = [].slice.call(this.selEl.querySelectorAll('li[data-option]'));

                    this.selOptsCount = this.selOpts.length;

                    this.current = this.selOpts.indexOf(this.selEl.querySelector('li.cs-selected')) || -1;

                    this.selPlaceholder = this.selEl.querySelector('span.cs-placeholder');

                    this._initEvents();

                    this.el.onchange = function () {
                        var index = this.selectedIndex;
                        var inputText = this.children[index].innerHTML.trim();
                        console.log(inputText);
                    };
                };

                SelectFx.prototype._createSelectEl = function () {
                    var self = this,
                        options = '',
                        createOptionHTML = function createOptionHTML(el) {
                        var optclass = '',
                            classes = '',
                            link = '';

                        if (el.selectedOpt && !this.foundSelected && !this.hasDefaultPlaceholder) {
                            classes += 'cs-selected ';
                            this.foundSelected = true;
                        }

                        if (el.getAttribute('data-class')) {
                            classes += el.getAttribute('data-class');
                        }

                        if (el.getAttribute('data-link')) {
                            link = 'data-link=' + el.getAttribute('data-link');
                        }

                        if (classes !== '') {
                            optclass = 'class="' + classes + '" ';
                        }

                        return '<li ' + optclass + link + ' data-option data-value="' + el.value + '"><span>' + el.textContent + '</span></li>';
                    };

                    [].slice.call(this.el.children).forEach(function (el) {
                        if (el.disabled) {
                            return;
                        }

                        var tag = el.tagName.toLowerCase();

                        if (tag === 'option') {
                            options += createOptionHTML(el);
                        } else if (tag === 'optgroup') {
                            options += '<li class="cs-optgroup"><span>' + el.label + '</span><ul>';
                            [].slice.call(el.children).forEach(function (opt) {
                                options += createOptionHTML(opt);
                            });
                            options += '</ul></li>';
                        }
                    });

                    var opts_el = '<div class="cs-options"><ul>' + options + '</ul></div>';
                    this.selEl = document.createElement('div');
                    this.selEl.className = this.el.className;
                    this.selEl.tabIndex = this.el.tabIndex;
                    this.selEl.innerHTML = '<span class="cs-placeholder">' + this.selectedOpt.textContent + '</span>' + opts_el;
                    this.el.parentNode.appendChild(this.selEl);
                    this.selEl.appendChild(this.el);

                    var backdrop = document.createElement('div');
                    backdrop.className = 'cs-backdrop';
                    this.selEl.appendChild(backdrop);
                };

                SelectFx.prototype._initEvents = function () {
                    var self = this;

                    this.selPlaceholder.addEventListener('click', function () {
                        self._toggleSelect();
                    });

                    this.selOpts.forEach(function (opt, idx) {
                        opt.addEventListener('click', function () {
                            self.current = idx;
                            self._changeOption();

                            self._toggleSelect();
                        });
                    });

                    document.addEventListener('click', function (ev) {
                        var target = ev.target;
                        if (self._isOpen() && target !== self.selEl && !hasParent(target, self.selEl)) {
                            self._toggleSelect();
                        }
                    });

                    this.selEl.addEventListener('keydown', function (ev) {
                        var keyCode = ev.keyCode || ev.which;

                        switch (keyCode) {
                            case 38:
                                ev.preventDefault();
                                self._navigateOpts('prev');
                                break;

                            case 40:
                                ev.preventDefault();
                                self._navigateOpts('next');
                                break;

                            case 32:
                                ev.preventDefault();
                                if (self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1) {
                                    self._changeOption();
                                }
                                self._toggleSelect();
                                break;

                            case 13:
                                ev.preventDefault();
                                if (self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1) {
                                    self._changeOption();
                                    self._toggleSelect();
                                }
                                break;

                            case 27:
                                ev.preventDefault();
                                if (self._isOpen()) {
                                    self._toggleSelect();
                                }
                                break;
                        }
                    });
                };

                SelectFx.prototype._navigateOpts = function (dir) {
                    if (!this._isOpen()) {
                        this._toggleSelect();
                    }

                    var tmpcurrent = typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1 ? this.preSelCurrent : this.current;

                    if (dir === 'prev' && tmpcurrent > 0 || dir === 'next' && tmpcurrent < this.selOptsCount - 1) {
                        this.preSelCurrent = dir === 'next' ? tmpcurrent + 1 : tmpcurrent - 1;

                        this._removeFocus();

                        classie.add(this.selOpts[this.preSelCurrent], 'cs-focus');
                    }
                };

                SelectFx.prototype._toggleSelect = function () {
                    var backdrop = this.selEl.querySelector('.cs-backdrop');
                    var container = document.querySelector(this.options.container);
                    var mask = container.querySelector('.dropdown-mask');
                    var csOptions = this.selEl.querySelector('.cs-options');
                    var csPlaceholder = this.selEl.querySelector('.cs-placeholder');

                    var csPlaceholderWidth = csPlaceholder.offsetWidth;
                    var csPlaceholderHeight = csPlaceholder.offsetHeight;
                    var csOptionsWidth = csOptions.scrollWidth;

                    if (this._isOpen()) {
                        if (this.current !== -1) {
                            this.selPlaceholder.textContent = this.selOpts[this.current].textContent;
                        }

                        var dummy = this.selEl.data;

                        var parent = dummy.parentNode;

                        insertAfter(this.selEl, dummy);
                        this.selEl.removeAttribute('style');

                        parent.removeChild(dummy);

                        var x = this.selEl.clientHeight;

                        backdrop.style.transform = backdrop.style.webkitTransform = backdrop.style.MozTransform = backdrop.style.msTransform = backdrop.style.OTransform = 'scale3d(1,1,1)';
                        classie.remove(this.selEl, 'cs-active');

                        mask.style.display = 'none';
                        csOptions.style.overflowY = 'hidden';
                        csOptions.style.width = 'auto';

                        var parentFormGroup = closest(this.selEl, '.form-group');
                        parentFormGroup && classie.removeClass(parentFormGroup, 'focused');
                    } else {
                        if (this.hasDefaultPlaceholder && this.options.stickyPlaceholder) {
                            this.selPlaceholder.textContent = this.selectedOpt.textContent;
                        }

                        var dummy;
                        if (this.selEl.parentNode.querySelector('.dropdown-placeholder')) {
                            dummy = this.selEl.parentNode.querySelector('.dropdown-placeholder');
                        } else {
                            dummy = document.createElement('div');
                            classie.add(dummy, 'dropdown-placeholder');

                            insertAfter(dummy, this.selEl);
                        }

                        dummy.style.height = csPlaceholderHeight + 'px';
                        dummy.style.width = this.selEl.offsetWidth + 'px';

                        this.selEl.data = dummy;

                        this.selEl.style.position = 'absolute';
                        var offsetselEl = offset(this.selEl);

                        this.selEl.style.left = offsetselEl.left + 'px';
                        this.selEl.style.top = offsetselEl.top + 'px';

                        container.appendChild(this.selEl);

                        var contentHeight = csOptions.offsetHeight;
                        var originalHeight = csPlaceholder.offsetHeight;

                        var contentWidth = csOptions.offsetWidth;
                        var originalWidth = csPlaceholder.offsetWidth;

                        var scaleV = contentHeight / originalHeight;
                        var scaleH = contentWidth > originalWidth ? contentWidth / originalWidth : 1.05;

                        backdrop.style.transform = backdrop.style.webkitTransform = backdrop.style.MozTransform = backdrop.style.msTransform = backdrop.style.OTransform = 'scale3d(' + 1 + ', ' + scaleV + ', 1)';

                        if (!mask) {
                            mask = document.createElement('div');
                            classie.add(mask, 'dropdown-mask');
                            container.appendChild(mask);
                        }

                        mask.style.display = 'block';

                        classie.add(this.selEl, 'cs-active');

                        var resizedWidth = csPlaceholderWidth < csOptionsWidth ? csOptionsWidth : csPlaceholderWidth;

                        this.selEl.style.width = resizedWidth + 'px';
                        this.selEl.style.height = originalHeight + 'px';
                        csOptions.style.width = '100%';

                        setTimeout(function () {
                            csOptions.style.overflowY = 'auto';
                        }, 300);
                    }
                };

                SelectFx.prototype._changeOption = function () {
                    if (typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1) {
                        this.current = this.preSelCurrent;
                        this.preSelCurrent = -1;
                    }

                    var opt = this.selOpts[this.current];

                    this.selPlaceholder.textContent = opt.textContent;

                    this.el.value = opt.getAttribute('data-value');

                    var oldOpt = this.selEl.querySelector('li.cs-selected');
                    if (oldOpt) {
                        classie.remove(oldOpt, 'cs-selected');
                    }
                    classie.add(opt, 'cs-selected');

                    if (opt.getAttribute('data-link')) {
                        if (this.options.newTab) {
                            window.open(opt.getAttribute('data-link'), '_blank');
                        } else {
                            window.location = opt.getAttribute('data-link');
                        }
                    }

                    this.options.onChange(this.el);
                };

                SelectFx.prototype._isOpen = function (opt) {
                    return classie.has(this.selEl, 'cs-active');
                };

                SelectFx.prototype._removeFocus = function (opt) {
                    var focusEl = this.selEl.querySelector('li.cs-focus');
                    if (focusEl) {
                        classie.remove(focusEl, 'cs-focus');
                    }
                };

                window.SelectFx = SelectFx;
            })(window);

            (function ($) {
                'use strict';

                var Progress = function Progress(element, options) {
                    this.$element = $(element);
                    this.options = $.extend(true, {}, $.fn.circularProgress.defaults, options);

                    this.$container = $('<div class="progress-circle"></div>');

                    this.$element.attr('data-color') && this.$container.addClass('progress-circle-' + this.$element.attr('data-color'));
                    this.$element.attr('data-thick') && this.$container.addClass('progress-circle-thick');

                    this.$pie = $('<div class="pie"></div>');

                    this.$pie.$left = $('<div class="left-side half-circle"></div>');
                    this.$pie.$right = $('<div class="right-side half-circle"></div>');

                    this.$pie.append(this.$pie.$left).append(this.$pie.$right);

                    this.$container.append(this.$pie).append('<div class="shadow"></div>');

                    this.$element.after(this.$container);

                    this.val = this.$element.val();
                    var deg = perc2deg(this.val);

                    if (this.val <= 50) {
                        this.$pie.$right.css('transform', 'rotate(' + deg + 'deg)');
                    } else {
                        this.$pie.css('clip', 'rect(auto, auto, auto, auto)');
                        this.$pie.$right.css('transform', 'rotate(180deg)');
                        this.$pie.$left.css('transform', 'rotate(' + deg + 'deg)');
                    }
                };
                Progress.VERSION = "1.0.0";

                Progress.prototype.value = function (val) {
                    if (typeof val == 'undefined') return;

                    var deg = perc2deg(val);

                    this.$pie.removeAttr('style');

                    this.$pie.$right.removeAttr('style');
                    this.$pie.$left.removeAttr('style');

                    if (val <= 50) {
                        this.$pie.$right.css('transform', 'rotate(' + deg + 'deg)');
                    } else {
                        this.$pie.css('clip', 'rect(auto, auto, auto, auto)');
                        this.$pie.$right.css('transform', 'rotate(180deg)');
                        this.$pie.$left.css('transform', 'rotate(' + deg + 'deg)');
                    }
                };

                function Plugin(option) {
                    return this.filter(':input').each(function () {
                        var $this = $(this);
                        var data = $this.data('pg.circularProgress');
                        var options = typeof option == 'object' && option;

                        if (!data) $this.data('pg.circularProgress', data = new Progress(this, options));
                        if (typeof option == 'string') data[option]();else if (options.hasOwnProperty('value')) data.value(options.value);
                    });
                }

                var old = $.fn.circularProgress;

                $.fn.circularProgress = Plugin;
                $.fn.circularProgress.Constructor = Progress;

                $.fn.circularProgress.defaults = {
                    value: 0
                };

                $.fn.circularProgress.noConflict = function () {
                    $.fn.circularProgress = old;
                    return this;
                };

                $(window).on('load', function () {
                    $('[data-pages-progress="circle"]').each(function () {
                        var $progress = $(this);
                        $progress.circularProgress($progress.data());
                    });
                });

                function perc2deg(p) {
                    return parseInt(p / 100 * 360);
                }
            })(window.jQuery);

            (function ($) {
                'use strict';

                var Portlet = function Portlet(element, options) {
                    this.$element = $(element);
                    this.options = $.extend(true, {}, $.fn.portlet.defaults, options);
                    this.$loader = null;
                    this.$body = this.$element.find('.panel-body');
                };
                Portlet.VERSION = "1.0.0";

                Portlet.prototype.collapse = function () {
                    var icon = this.$element.find(this.options.collapseButton + ' > i');
                    var heading = this.$element.find('.panel-heading');

                    this.$body.stop().slideToggle("fast");

                    if (this.$element.hasClass('panel-collapsed')) {
                        this.$element.removeClass('panel-collapsed');
                        icon.removeClass().addClass('pg-arrow_maximize');
                        $.isFunction(this.options.onExpand) && this.options.onExpand();
                        return;
                    }
                    this.$element.addClass('panel-collapsed');
                    icon.removeClass().addClass('pg-arrow_minimize');
                    $.isFunction(this.options.onCollapse) && this.options.onCollapse();
                };

                Portlet.prototype.close = function () {
                    this.$element.remove();
                    $.isFunction(this.options.onClose) && this.options.onClose();
                };

                Portlet.prototype.maximize = function () {
                    var icon = this.$element.find(this.options.maximizeButton + ' > i');

                    if (this.$element.hasClass('panel-maximized')) {
                        this.$element.removeClass('panel-maximized');
                        icon.removeClass('pg-fullscreen_restore').addClass('pg-fullscreen');
                        $.isFunction(this.options.onRestore) && this.options.onRestore();
                    } else {
                        this.$element.addClass('panel-maximized');
                        icon.removeClass('pg-fullscreen').addClass('pg-fullscreen_restore');
                        $.isFunction(this.options.onMaximize) && this.options.onMaximize();
                    }
                };

                Portlet.prototype.refresh = function (refresh) {
                    var toggle = this.$element.find(this.options.refreshButton);

                    if (refresh) {
                        if (this.$loader && this.$loader.is(':visible')) return;
                        if (!$.isFunction(this.options.onRefresh)) return;
                        this.$loader = $('<div class="portlet-progress"></div>');
                        this.$loader.css({
                            'background-color': 'rgba(' + this.options.overlayColor + ',' + this.options.overlayOpacity + ')'

                        });

                        var elem = '';
                        if (this.options.progress == 'circle') {
                            elem += '<div class="progress-circle-indeterminate progress-circle-' + this.options.progressColor + '"></div>';
                        } else if (this.options.progress == 'bar') {

                            elem += '<div class="progress progress-small">';
                            elem += '    <div class="progress-bar-indeterminate progress-bar-' + this.options.progressColor + '"></div>';
                            elem += '</div>';
                        } else if (this.options.progress == 'circle-lg') {
                            toggle.addClass('refreshing');
                            var iconOld = toggle.find('> i').first();
                            var iconNew;
                            if (!toggle.find('[class$="-animated"]').length) {
                                iconNew = $('<i/>');
                                iconNew.css({
                                    'position': 'absolute',
                                    'top': iconOld.position().top,
                                    'left': iconOld.position().left
                                });
                                iconNew.addClass('portlet-icon-refresh-lg-' + this.options.progressColor + '-animated');
                                toggle.append(iconNew);
                            } else {
                                iconNew = toggle.find('[class$="-animated"]');
                            }

                            iconOld.addClass('fade');
                            iconNew.addClass('active');
                        } else {
                            elem += '<div class="progress progress-small">';
                            elem += '    <div class="progress-bar-indeterminate progress-bar-' + this.options.progressColor + '"></div>';
                            elem += '</div>';
                        }

                        this.$loader.append(elem);
                        this.$element.append(this.$loader);

                        var _loader = this.$loader;
                        setTimeout((function () {
                            this.$loader.remove();
                            this.$element.append(_loader);
                        }).bind(this), 300);

                        this.$loader.fadeIn();

                        $.isFunction(this.options.onRefresh) && this.options.onRefresh();
                    } else {
                        var _this = this;
                        this.$loader.fadeOut(function () {
                            $(this).remove();
                            if (_this.options.progress == 'circle-lg') {
                                var iconNew = toggle.find('.active');
                                var iconOld = toggle.find('.fade');
                                iconNew.removeClass('active');
                                iconOld.removeClass('fade');
                                toggle.removeClass('refreshing');
                            }
                            _this.options.refresh = false;
                        });
                    }
                };

                Portlet.prototype.error = function (error) {
                    if (error) {
                        var _this = this;
                        this.$element.pgNotification({
                            style: 'bar',
                            message: error,
                            position: 'top',
                            timeout: 0,
                            type: 'danger',
                            onShown: function onShown() {
                                _this.$loader.find('> div').fadeOut();
                            },
                            onClosed: function onClosed() {
                                _this.refresh(false);
                            }
                        }).show();
                    }
                };

                function Plugin(option) {
                    return this.each(function () {
                        var $this = $(this);
                        var data = $this.data('pg.portlet');
                        var options = typeof option == 'object' && option;

                        if (!data) $this.data('pg.portlet', data = new Portlet(this, options));
                        if (typeof option == 'string') data[option]();else if (options.hasOwnProperty('refresh')) data.refresh(options.refresh);else if (options.hasOwnProperty('error')) data.error(options.error);
                    });
                }

                var old = $.fn.portlet;

                $.fn.portlet = Plugin;
                $.fn.portlet.Constructor = Portlet;

                $.fn.portlet.defaults = {
                    progress: 'circle',
                    progressColor: 'master',
                    refresh: false,
                    error: null,
                    overlayColor: '255,255,255',
                    overlayOpacity: 0.8,
                    refreshButton: '[data-toggle="refresh"]',
                    maximizeButton: '[data-toggle="maximize"]',
                    collapseButton: '[data-toggle="collapse"]',
                    closeButton: '[data-toggle="close"]'

                };

                $.fn.portlet.noConflict = function () {
                    $.fn.portlet = old;
                    return this;
                };

                $(document).on('click.pg.portlet.data-api', '[data-toggle="collapse"]', function (e) {
                    var $this = $(this);
                    var $target = $this.closest('.panel');
                    if ($this.is('a')) e.preventDefault();
                    $target.data('pg.portlet') && $target.portlet('collapse');
                });

                $(document).on('click.pg.portlet.data-api', '[data-toggle="close"]', function (e) {
                    var $this = $(this);
                    var $target = $this.closest('.panel');
                    if ($this.is('a')) e.preventDefault();
                    $target.data('pg.portlet') && $target.portlet('close');
                });

                $(document).on('click.pg.portlet.data-api', '[data-toggle="refresh"]', function (e) {
                    var $this = $(this);
                    var $target = $this.closest('.panel');
                    if ($this.is('a')) e.preventDefault();
                    $target.data('pg.portlet') && $target.portlet({
                        refresh: true
                    });
                });

                $(document).on('click.pg.portlet.data-api', '[data-toggle="maximize"]', function (e) {
                    var $this = $(this);
                    var $target = $this.closest('.panel');
                    if ($this.is('a')) e.preventDefault();
                    $target.data('pg.portlet') && $target.portlet('maximize');
                });

                $(window).on('load', function () {
                    $('[data-pages="portlet"]').each(function () {
                        var $portlet = $(this);
                        $portlet.portlet($portlet.data());
                    });
                });
            })(window.jQuery);

            (function ($) {
                'use strict';

                var Parallax = function Parallax(element, options) {
                    this.$element = $(element);
                    this.options = $.extend(true, {}, $.fn.parallax.defaults, options);
                    this.$coverPhoto = this.$element.find('.cover-photo');

                    this.$content = this.$element.find('.inner');

                    if (this.$coverPhoto.find('> img').length) {
                        var img = this.$coverPhoto.find('> img');
                        this.$coverPhoto.css('background-image', 'url(' + img.attr('src') + ')');
                        img.remove();
                    }
                };
                Parallax.VERSION = "1.0.0";

                Parallax.prototype.animate = function () {

                    var scrollPos;
                    var pagecoverWidth = this.$element.height();

                    var opacityKeyFrame = pagecoverWidth * 50 / 100;
                    var direction = 'translateX';

                    scrollPos = $(window).scrollTop();
                    direction = 'translateY';

                    this.$coverPhoto.css({
                        'transform': direction + '(' + scrollPos * this.options.speed.coverPhoto + 'px)'
                    });

                    this.$content.css({
                        'transform': direction + '(' + scrollPos * this.options.speed.content + 'px)'
                    });

                    if (scrollPos > opacityKeyFrame) {
                        this.$content.css({
                            'opacity': 1 - scrollPos / 1200
                        });
                    } else {
                        this.$content.css({
                            'opacity': 1
                        });
                    }
                };

                function Plugin(option) {
                    return this.each(function () {
                        var $this = $(this);
                        var data = $this.data('pg.parallax');
                        var options = typeof option == 'object' && option;

                        if (!data) $this.data('pg.parallax', data = new Parallax(this, options));
                        if (typeof option == 'string') data[option]();
                    });
                }

                var old = $.fn.parallax;

                $.fn.parallax = Plugin;
                $.fn.parallax.Constructor = Parallax;

                $.fn.parallax.defaults = {
                    speed: {
                        coverPhoto: 0.3,
                        content: 0.17
                    }
                };

                $.fn.parallax.noConflict = function () {
                    $.fn.parallax = old;
                    return this;
                };

                $(window).on('load', function () {

                    $('[data-pages="parallax"]').each(function () {
                        var $parallax = $(this);
                        $parallax.parallax($parallax.data());
                    });
                });

                $(window).on('scroll', function () {
                    if (Modernizr.touch) {
                        return;
                    }
                    $('[data-pages="parallax"]').parallax('animate');
                });
            })(window.jQuery);

            (function ($) {
                'use strict';

                var Sidebar = function Sidebar(element, options) {
                    this.$element = $(element);
                    this.options = $.extend(true, {}, $.fn.sidebar.defaults, options);

                    this.bezierEasing = [.05, .74, .27, .99];
                    this.cssAnimation = true;
                    this.menuClosedCSS;
                    this.menuOpenCSS;
                    this.css3d = true;

                    this.sideBarWidth = 280;
                    this.sideBarWidthCondensed = 280 - 70;

                    this.$sidebarMenu = this.$element.find('.sidebar-menu > ul');
                    this.$pageContainer = $(this.options.pageContainer);
                    this.$body = $('body');

                    if (!this.$sidebarMenu.length) return;

                    $.Pages.getUserAgent() == 'desktop' && this.$sidebarMenu.scrollbar({
                        ignoreOverlay: false
                    });

                    if (!Modernizr.csstransitions) this.cssAnimation = false;
                    if (!Modernizr.csstransforms3d) this.css3d = false;

                    this.menuOpenCSS = this.css3d == true ? 'translate3d(' + this.sideBarWidthCondensed + 'px, 0,0)' : 'translate(' + this.sideBarWidthCondensed + 'px, 0)';
                    this.menuClosedCSS = this.css3d == true ? 'translate3d(0, 0,0)' : 'translate(0, 0)';

                    $('body').on('click', '.sidebar-menu a', function (e) {

                        if ($(this).parent().children('.sub-menu') === false) {
                            return;
                        }

                        var parent = $(this).parent().parent();
                        var tempElem = $(this).parent();

                        parent.children('li.open').children('a').children('.arrow').removeClass('open');
                        parent.children('li.open').children('a').children('.arrow').removeClass('active');
                        parent.children('li.open').children('.sub-menu').slideUp(200, function () {});
                        parent.children('li').removeClass('open');
                        var sub = $(this).parent().children('.sub-menu');
                        if (sub.is(":visible")) {
                            $('.arrow', $(this)).removeClass("open");

                            sub.slideUp(200, function () {
                                $(this).parent().removeClass("active");
                            });
                        } else {
                            $('.arrow', $(this)).addClass("open");
                            $(this).parent().addClass("open");
                            sub.slideDown(200, function () {});
                        }
                    });

                    $('.sidebar-slide-toggle').on('click touchend', function (e) {
                        e.preventDefault();
                        $(this).toggleClass('active');
                        var el = $(this).attr('data-pages-toggle');
                        if (el != null) {
                            $(el).toggleClass('show');
                        }
                    });

                    var _this = this;

                    function sidebarMouseEnter(e) {
                        if ($.Pages.isVisibleSm() || $.Pages.isVisibleXs()) {
                            return false;
                        }
                        if ($('.close-sidebar').data('clicked')) {
                            return;
                        }
                        if (_this.$body.hasClass('menu-pin')) return;
                        if (_this.cssAnimation) {
                            _this.$element.css({
                                'transform': _this.menuOpenCSS
                            });
                            _this.$body.addClass('sidebar-visible');
                        } else {
                            _this.$element.stop().animate({
                                left: '0px'
                            }, 400, $.bez(_this.bezierEasing), function () {
                                _this.$body.addClass('sidebar-visible');
                            });
                        }
                    }

                    function sidebarMouseLeave(e) {
                        if ($.Pages.isVisibleSm() || $.Pages.isVisibleXs()) {
                            return false;
                        }
                        if (typeof e != 'undefined') {
                            var target = $(e.target);
                            if (target.parent('.page-sidebar').length) {
                                return;
                            }
                        }
                        if (_this.$body.hasClass('menu-pin')) return;

                        if ($('.sidebar-overlay-slide').hasClass('show')) {
                            $('.sidebar-overlay-slide').removeClass('show');
                            $("[data-pages-toggle']").removeClass('active');
                        }

                        if (_this.cssAnimation) {
                            _this.$element.css({
                                'transform': _this.menuClosedCSS
                            });
                            _this.$body.removeClass('sidebar-visible');
                        } else {

                            _this.$element.stop().animate({
                                left: '-' + _this.sideBarWidthCondensed + 'px'
                            }, 400, $.bez(_this.bezierEasing), function () {

                                _this.$body.removeClass('sidebar-visible');
                                setTimeout(function () {
                                    $('.close-sidebar').data({
                                        clicked: false
                                    });
                                }, 100);
                            });
                        }
                    }

                    this.$element.bind('mouseenter mouseleave', sidebarMouseEnter);
                    this.$pageContainer.bind('mouseover', sidebarMouseLeave);
                };

                Sidebar.prototype.toggleSidebar = function (toggle) {
                    var timer;
                    var bodyColor = $('body').css('background-color');
                    $('.page-container').css('background-color', bodyColor);
                    if (this.$body.hasClass('sidebar-open')) {
                        this.$body.removeClass('sidebar-open');
                        timer = setTimeout((function () {
                            this.$element.removeClass('visible');
                        }).bind(this), 400);
                    } else {
                        clearTimeout(timer);
                        this.$element.addClass('visible');
                        setTimeout((function () {
                            this.$body.addClass('sidebar-open');
                        }).bind(this), 10);
                        setTimeout(function () {
                            $('.page-container').css({ 'background-color': '' });
                        }, 1000);
                    }
                };

                Sidebar.prototype.togglePinSidebar = function (toggle) {
                    if (toggle == 'hide') {
                        this.$body.removeClass('menu-pin');
                    } else if (toggle == 'show') {
                        this.$body.addClass('menu-pin');
                    } else {
                        this.$body.toggleClass('menu-pin');
                    }
                    $(document).trigger('reflowMasonry');
                };

                function Plugin(option) {
                    return this.each(function () {
                        var $this = $(this);
                        var data = $this.data('pg.sidebar');
                        var options = typeof option == 'object' && option;

                        if (!data) $this.data('pg.sidebar', data = new Sidebar(this, options));
                        if (typeof option == 'string') data[option]();
                    });
                }

                var old = $.fn.sidebar;

                $.fn.sidebar = Plugin;
                $.fn.sidebar.Constructor = Sidebar;

                $.fn.sidebar.defaults = {
                    pageContainer: '.page-container'
                };

                $.fn.sidebar.noConflict = function () {
                    $.fn.sidebar = old;
                    return this;
                };

                $(document).on('click.pg.sidebar.data-api', '[data-toggle-pin="sidebar"]', function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $target = $('[data-pages="sidebar"]');
                    $target.data('pg.sidebar').togglePinSidebar();
                    return false;
                });
                $(document).on('click.pg.sidebar.data-api touchstart', '[data-toggle="sidebar"]', function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $target = $('[data-pages="sidebar"]');
                    $target.data('pg.sidebar').toggleSidebar();
                    return false;
                });
            })(window.jQuery);

            (function ($) {

                'use strict';

                var Search = function Search(element, options) {
                    this.$element = $(element);
                    this.options = $.extend(true, {}, $.fn.search.defaults, options);
                    this.init();
                };
                Search.VERSION = "1.0.0";

                Search.prototype.init = function () {
                    var _this = this;
                    this.pressedKeys = [];
                    this.ignoredKeys = [];

                    this.$searchField = this.$element.find(this.options.searchField);
                    this.$closeButton = this.$element.find(this.options.closeButton);
                    this.$suggestions = this.$element.find(this.options.suggestions);
                    this.$brand = this.$element.find(this.options.brand);

                    this.$searchField.on('keyup', function (e) {
                        _this.$suggestions && _this.$suggestions.html($(this).val());
                    });

                    this.$searchField.on('keyup', function (e) {
                        _this.options.onKeyEnter && _this.options.onKeyEnter(_this.$searchField.val());
                        if (e.keyCode == 13) {
                            e.preventDefault();
                            _this.options.onSearchSubmit && _this.options.onSearchSubmit(_this.$searchField.val());
                        }
                        if ($('body').hasClass('overlay-disabled')) {
                            return 0;
                        }
                    });

                    this.$closeButton.on('click', function () {
                        _this.toggleOverlay('hide');
                    });

                    this.$element.on('click', function (e) {
                        if ($(e.target).data('pages') == 'search') {
                            _this.toggleOverlay('hide');
                        }
                    });

                    $(document).on('keypress.pg.search', function (e) {
                        _this.keypress(e);
                    });

                    $(document).on('keyup', function (e) {
                        if (_this.$element.is(':visible') && e.keyCode == 27) {
                            _this.toggleOverlay('hide');
                        }
                    });
                };

                Search.prototype.keypress = function (e) {

                    e = e || event;
                    var nodeName = e.target.nodeName;
                    if ($('body').hasClass('overlay-disabled') || $(e.target).hasClass('js-input') || nodeName == 'INPUT' || nodeName == 'TEXTAREA') {
                        return;
                    }

                    if (e.which !== 0 && e.charCode !== 0 && !e.ctrlKey && !e.metaKey && !e.altKey && e.keyCode != 27) {
                        this.toggleOverlay('show', String.fromCharCode(e.keyCode | e.charCode));
                    }
                };

                Search.prototype.toggleOverlay = function (action, key) {
                    var _this = this;
                    if (action == 'show') {
                        this.$element.removeClass("hide");
                        this.$element.fadeIn("fast");
                        if (!this.$searchField.is(':focus')) {
                            this.$searchField.val(key);
                            setTimeout((function () {
                                this.$searchField.focus();
                                var tmpStr = this.$searchField.val();
                                this.$searchField.val('');
                                this.$searchField.val(tmpStr);
                            }).bind(this), 100);
                        }

                        this.$element.removeClass("closed");
                        this.$brand.toggleClass('invisible');
                        $(document).off('keypress.pg.search');
                    } else {
                        this.$element.fadeOut("fast").addClass("closed");
                        this.$searchField.val('').blur();
                        setTimeout((function () {
                            if (this.$element.is(':visible')) {
                                this.$brand.toggleClass('invisible');
                            }
                            $(document).on('keypress.pg.search', function (e) {
                                _this.keypress(e);
                            });
                        }).bind(this), 100);
                    }
                };

                function Plugin(option) {
                    return this.each(function () {
                        var $this = $(this);
                        var data = $this.data('pg.search');
                        var options = typeof option == 'object' && option;

                        if (!data) {
                            $this.data('pg.search', data = new Search(this, options));
                        }
                        if (typeof option == 'string') data[option]();
                    });
                }

                var old = $.fn.search;

                $.fn.search = Plugin;
                $.fn.search.Constructor = Search;

                $.fn.search.defaults = {
                    searchField: '[data-search="searchField"]',
                    closeButton: '[data-search="closeButton"]',
                    suggestions: '[data-search="suggestions"]',
                    brand: '[data-search="brand"]'
                };

                $.fn.search.noConflict = function () {
                    $.fn.search = old;
                    return this;
                };

                $(document).on('click.pg.search.data-api', '[data-toggle="search"]', function (e) {
                    var $this = $(this);
                    var $target = $('[data-pages="search"]');
                    if ($this.is('a')) e.preventDefault();
                    $target.data('pg.search').toggleOverlay('show');
                });
            })(window.jQuery);
            (function ($) {
                'use strict';

                typeof angular === 'undefined' && $.Pages.init();
            })(window.jQuery);
        }
    };
});
//# sourceMappingURL=pages.js.map

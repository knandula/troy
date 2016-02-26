System.register([], function (_export) {
    'use strict';

    return {
        setters: [],
        execute: function () {

            angular.module('app').directive('csSelect', function () {
                return {
                    restrict: 'A',
                    link: function link(scope, el, attrs) {
                        if (!window.SelectFx) return;

                        var el = $(el).get(0);
                        $(el).wrap('<div class="cs-wrapper"></div>');
                        new SelectFx(el);
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=cs-select.js.map

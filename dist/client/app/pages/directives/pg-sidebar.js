System.register([], function (_export) {
    'use strict';

    return {
        setters: [],
        execute: function () {

            angular.module('app').directive('pgSidebar', function () {
                return {
                    restrict: 'A',
                    link: function link(scope, element) {
                        var $sidebar = $(element);
                        $sidebar.sidebar($sidebar.data());
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=pg-sidebar.js.map

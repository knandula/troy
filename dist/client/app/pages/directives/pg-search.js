System.register([], function (_export) {
    'use strict';

    return {
        setters: [],
        execute: function () {

            angular.module('app').directive('pgSearch', ['$parse', function ($parse) {
                return {
                    restrict: 'A',
                    link: function link(scope, element, attrs) {
                        $(element).search();

                        scope.$on('toggleSearchOverlay', function (scopeDetails, status) {
                            if (status.show) {
                                $(element).data('pg.search').toggleOverlay('show');
                            } else {
                                $(element).data('pg.search').toggleOverlay('hide');
                            }
                        });
                    }
                };
            }]);
        }
    };
});
//# sourceMappingURL=pg-search.js.map

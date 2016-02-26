System.register([], function (_export) {
    'use strict';

    return {
        setters: [],
        execute: function () {

            angular.module('app').directive('pgNavigate', function () {
                return {
                    restrict: 'A',
                    link: function link(scope, element, attrs) {

                        $(element).click(function () {
                            var el = $(this).attr('data-view-port');
                            if ($(this).attr('data-toggle-view') != null) {
                                $(el).children().last().children('.view').hide();
                                $($(this).attr('data-toggle-view')).show();
                            }
                            $(el).toggleClass($(this).attr('data-view-animation'));
                            return false;
                        });
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=pg-navigate.js.map

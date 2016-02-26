System.register([], function (_export) {
    'use strict';

    return {
        setters: [],
        execute: function () {

            angular.module('app').directive('skycons', function () {
                return {
                    restrict: 'A',
                    link: function link(scope, element, attrs) {
                        var skycons = new Skycons();
                        skycons.add($(element).get(0), attrs['class']);
                        skycons.play();
                    }
                };
            });
        }
    };
});
//# sourceMappingURL=skycons.js.map

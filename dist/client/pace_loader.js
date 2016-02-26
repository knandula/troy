System.register(['pace/themes/green/pace-theme-flash.css!css', 'pace'], function (_export) {
  'use strict';

  var Pace;
  return {
    setters: [function (_paceThemesGreenPaceThemeFlashCssCss) {}, function (_pace) {
      Pace = _pace['default'];
    }],
    execute: function () {

      Pace.start();

      _export('default', Pace);
    }
  };
});
//# sourceMappingURL=pace_loader.js.map

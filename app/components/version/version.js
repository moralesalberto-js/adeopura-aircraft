'use strict';

angular.module('airTrafficControlApp.version', [
  'airTrafficControlApp.version.interpolate-filter',
  'airTrafficControlApp.version.version-directive'
])

.value('version', '0.1');

'use strict';

describe('airTrafficControlApp.version module', function() {
  beforeEach(module('airTrafficControlApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});

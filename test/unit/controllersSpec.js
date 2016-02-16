'use strict';

// System is booted and the user is trying to access
// the home page
// Redirect the user to the airTrafficControlAndStatus
describe('airTrafficControlApp Home controller', function() {
  beforeEach(module('airTrafficControlApp'));
  var scope, homeController, mockSystemBootService, $location;
  
  beforeEach(function(){  
    mockSystemBootService = {
      systemIsBooted: function(){
        return true;
      }
    };
    
    module(function($provide){
      $provide.value('systemBootService', mockSystemBootService);
    });
    
    inject(function($injector){
      mockSystemBootService = $injector.get('systemBootService');
      $location = $injector.get('$location');
    });
  });
  
  it('should redirect to the air traffic control and status page if system is already booted', inject(function($controller) {    
    var scope = {};
    
    homeController = $controller('homeController', {$scope : scope});
    expect($location.path()).toBe('/airTrafficControlAndStatus');    
  }));
    
});

// System is not booted and the user is directly trying to access
// the airTrafficControlAndStatus
// Redirect the user to the home page
describe('airTrafficControlApp airTrafficControlAndStatus controller', function() {
  beforeEach(module('airTrafficControlApp'));
  var scope, airTrafficControlAndStatusController, mockSystemBootService, $location;
  
  beforeEach(function(){
     mockSystemBootService = {
      handleUnbootedSystemAccess: function(){
        $location.path("/");;
      },
      systemIsBooted: function(){
        
        return false;
      }
    };
    
    module(function($provide){
      $provide.value('systemBootService', mockSystemBootService);
    });
    
    inject(function($injector){
      mockSystemBootService = $injector.get('systemBootService');
      $location = $injector.get('$location');
    });
  });
  
  it('should redirect to the home page if system is not booted', inject(function($controller) {    
    var scope = {};
    
    airTrafficControlAndStatusController = $controller('airTrafficControlAndStatus', {$scope : scope});
    expect($location.path()).toBe('/');    
  }));
    
});

// System bootƒ
'use strict';

describe('queueManagementService', function() {
    beforeEach(module('airTrafficControlApp'));
    
    var queueManagementService, $q, $rootScope, $timeout;
    
    beforeEach (function(){
        
        inject(function($injector){
            queueManagementService = $injector.get('queueManagementService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
        });
    });
    
    it('should have an empty queue at the start', (function() {  
        expect(queueManagementService.numberOfItemsInQueue()).toBe(0);
    }));
    
    it('should be able to enqueue aircraft of different types and sizes', (function() {
        
        var aircraftPassengerLarge = {"type": "Passenger", "size": "Large", "timeAdded": new Date().getTime()};
        queueManagementService.enqueueItem(aircraftPassengerLarge);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(1);
        
        var aircraftPassengerSmall = {"type": "Passenger", "size": "Small", "timeAdded": new Date().getTime()};
        queueManagementService.enqueueItem(aircraftPassengerSmall);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(2);
        
        
        var aircraftCargoLarge = {"type": "Cargo", "size": "Large", "timeAdded": new Date().getTime()};
        queueManagementService.enqueueItem(aircraftCargoLarge);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(3);
        
        var aircraftCargoSmall = {"type": "Cargo", "size": "Small", "timeAdded": new Date().getTime()};
        queueManagementService.enqueueItem(aircraftCargoSmall);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(4);
    }));
    
    it('should be able to dequeue enqueue in priority order', (function() {
        
        var dateTimeFirst = new Date().getTime() - 1000;
        var dateTimeSecond = new Date().getTime() - 500;
        var dateTimeThird = new Date().getTime();
    
        // Passenger large
        var aircraftPassengerLargeFirst = {"type": "Passenger", "size": "Large", "timeAdded": dateTimeFirst};
        var aircraftPassengerLargeSecond = {"type": "Passenger", "size": "Large", "timeAdded": dateTimeSecond};
        var aircraftPassengerLargeThird = {"type": "Passenger", "size": "Large", "timeAdded": dateTimeThird};
        
        // Passenger small
        var aircraftPassengerSmallFirst = {"type": "Passenger", "size": "Small", "timeAdded": dateTimeFirst};
        var aircraftPassengerSmallSecond = {"type": "Passenger", "size": "Small", "timeAdded": dateTimeSecond};
        var aircraftPassengerSmallThird = {"type": "Passenger", "size": "Small", "timeAdded": dateTimeThird};
        
        // Cargo Large   
        var aircraftCargoLargeFirst = {"type": "Cargo", "size": "Large", "timeAdded": dateTimeFirst};
        var aircraftCargoLargeSecond = {"type": "Cargo", "size": "Large", "timeAdded": dateTimeSecond};
        var aircraftCargoLargeThird = {"type": "Cargo", "size": "Large", "timeAdded": dateTimeThird};
       
        
        // Cargo Small
        var aircraftCargoSmallFirst = {"type": "Cargo", "size": "Small", "timeAdded": dateTimeFirst};
        var aircraftCargoSmallSecond = {"type": "Cargo", "size": "Small", "timeAdded": dateTimeSecond};
        var aircraftCargoSmallThird = {"type": "Cargo", "size": "Small", "timeAdded": dateTimeThird};
       
        // Enqueue
        queueManagementService.enqueueItem(aircraftPassengerLargeFirst);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(1);
        
        
        queueManagementService.enqueueItem(aircraftCargoSmallFirst);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(2);
        
        queueManagementService.enqueueItem(aircraftCargoLargeFirst);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(3);
        
        
        queueManagementService.enqueueItem(aircraftPassengerLargeSecond);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(4);
        
        
        queueManagementService.enqueueItem(aircraftCargoLargeSecond);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(5);
         
        queueManagementService.enqueueItem(aircraftPassengerLargeThird);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(6);
       
       
        queueManagementService.enqueueItem(aircraftPassengerSmallFirst);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(7);
       
        queueManagementService.enqueueItem(aircraftCargoLargeThird);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(8);
        
        queueManagementService.enqueueItem(aircraftCargoSmallSecond);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(9);
       
        queueManagementService.enqueueItem(aircraftCargoSmallThird);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(10);
        
        queueManagementService.enqueueItem(aircraftPassengerSmallSecond);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(11);
       
        queueManagementService.enqueueItem(aircraftPassengerSmallThird);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(12);
        
        
        // Dequeue
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftPassengerLargeFirst)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(11);
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftPassengerLargeSecond)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(10);
        
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftPassengerLargeThird)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(9);
        
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftPassengerSmallFirst)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(8);
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftPassengerSmallSecond)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(7);
        
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftPassengerSmallThird)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(6);
        
        // Cargo Large
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftCargoLargeFirst)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(5);
        
        
        // Enqueue in between
        queueManagementService.enqueueItem(aircraftPassengerLargeThird);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(6);
        
        queueManagementService.enqueueItem(aircraftPassengerSmallThird);
        $timeout.flush();
        expect(queueManagementService.numberOfItemsInQueue()).toBe(7);
        // end enqueue in between
        
        
        // Resume dequeue
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftPassengerLargeThird)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(6);
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftPassengerSmallThird)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(5);
        
        
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftCargoLargeSecond)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(4);
        
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftCargoLargeThird)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(3);
        
        // Cargo Small
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftCargoSmallFirst)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(2);
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftCargoSmallSecond)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(1);
        
        var promise = queueManagementService.dequeueItemWithHighestPriority();
        $timeout.flush();
        var dequeuedAircraft = promise.$$state.value;   
        expect(angular.equals(dequeuedAircraft, aircraftCargoSmallThird)).toBe(true);
        expect(queueManagementService.numberOfItemsInQueue()).toBe(0);
        
    }));
    
});

describe('aircraftPriorityDeterminationService', function() {
    beforeEach(module('airTrafficControlApp'));
    
    var aircraftPriorityDeterminationService;
    var aircraftPassengerLarge = {"type": "Passenger", "size": "Large", "timeAdded": new Date().getTime()};
    var aircraftPassengerSmall = {"type": "Passenger", "size": "Small", "timeAdded": new Date().getTime()};
    var aircraftCargoLarge = {"type": "Cargo", "size": "Large", "timeAdded": new Date().getTime()};
    var aircraftCargoSmall = {"type": "Cargo", "size": "Small", "timeAdded": new Date().getTime()};
        
    
    beforeEach (function(){
        
        inject(function($injector){
            aircraftPriorityDeterminationService = $injector.get('aircraftPriorityDeterminationService');
        });
    });
    
    it('should consider Passenger Large as higer priority than Passenger Small', (function() {
        expect(aircraftPriorityDeterminationService.compare (aircraftPassengerLarge, aircraftPassengerSmall)).toBe(1);
    }));
    
    it('should consider Passenger Small as higer priority than Cargo Large', (function() {
        expect(aircraftPriorityDeterminationService.compare (aircraftPassengerSmall, aircraftCargoLarge)).toBe(1);
    }));
    
    it('should consider Cargo Large as higer priority than Cargo Small', (function() {
        expect(aircraftPriorityDeterminationService.compare (aircraftCargoLarge, aircraftCargoSmall)).toBe(1);
    }));
    
    it('should consider earlier enqueued aircrafts of the same type and size as higher priority than later enqueued aircrafts', (function() {
        var dateTimeFirst = new Date().getTime() - 1000;
        var dateTimeSecond = new Date().getTime() - 500;
    
        // Passenger large
        var aircraftPassengerLargeFirst = {"type": "Passenger", "size": "Large", "timeAdded": dateTimeFirst};
        var aircraftPassengerLargeSecond = {"type": "Passenger", "size": "Large", "timeAdded": dateTimeSecond};
        
        expect(aircraftPriorityDeterminationService.compare (aircraftPassengerLargeFirst, aircraftPassengerLargeSecond)).toBe(1);
    }));
    
});

// Services

// Boot service
airTrafficControlApp.service('systemBootService', ['$location', '$q', '$timeout', function($location, $q, $timeout){
    
    var self = this;
    // Initialize the system status to be
    // unstarted at the beginning
    this.systemBootStatus = 'Unstarted';
    
    // Have a function to determine if the system is booted
    this.systemIsBooted = function(){
        // Note that within a function, "this" will refer
        // to the function itself (Functions are objects in JS)
        // so use the self variable as defined earlier in the service
        // which refers to the service
        return (self.systemBootStatus === 'Booted');
    };
    
    // Function is called when the system is booted
    this.bootSystem = function(){
        // Async call
        var deferred = $q.defer();
        
        // Resolve the deferred if the system
        // is already booted
        if (true === self.systemIsBooted()) {
            deferred.resolve();
        }
        else {
            // emulate async call
            $timeout(function(){
                // Set the system to booted status
                self.systemBootStatus = 'Booted';
                
                // Resolve the deferred to indicate
                // success
                deferred.resolve(self.systemBootStatus);
                
            }, 50);
        }
        
        // Make sure to return a promise from the async call
        return deferred.promise;
    };
    
    // If the system is not booted, redirect to
    // home page
    this.handleUnbootedSystemAccess = function(){
        $location.path("/");
    };
        
}]);


// Aircraft Comparison service
airTrafficControlApp.service('aircraftPriorityDeterminationService', [function(){
    
    var self = this;
    
    // Compare two aircrafts
    // if aircraftA has higher priority over aircraftB, return 1
    // if aircraftA has lower priority over aircraftB, return -1
    // if aircraftA has the same priority as aircraftB, return 0
    
    self.compare = function (aircraftA, aircraftB) {
        // null checks
        if (aircraftA == null || aircraftB == null) {
            if (null == aircraftA && null == aircraftB) {
                return 0;
            }
            else if (null == aircraftA) {
                return -1;
            }
            else if (null == aircraftB) {
                return 1;
            }
        }
        
        // Compare priorities
        numericalPriorityAircraftA = self.determineNumericalPriority(aircraftA);
        numericalPriorityAircraftB = self.determineNumericalPriority(aircraftB);
        
        if (numericalPriorityAircraftA > numericalPriorityAircraftB) {
            //aircraft B has a higher priority
            return -1;
        }
        else if (numericalPriorityAircraftA < numericalPriorityAircraftB) {
            //aircraft A has a higher priority
            return 1;
        }
        
        // Both have same priority
        // compare time when the aircrafts were added to system
        var timeAddedToSystemComparison = self.compareTimeAddedToSystem(aircraftA.timeAdded, aircraftB.timeAdded);
        
        if (timeAddedToSystemComparison !== 0) {
            // If time when added to system is different, we already have our result
            return timeAddedToSystemComparison;
        }
        
        // Everything is the same, so the comparison returns a 0
        return 0;
    };
    
    self.compareTimeAddedToSystem = function (aircraftATimeAdded, aircraftBTimeAdded) {
        // Time added to system comparison based on problem specifications
        // Note that if the aircraft was added later, it will have lower priority
        // than any aircraft added earlier
        if (aircraftATimeAdded === aircraftBTimeAdded) {
            return 0;
        }
        
        if (aircraftATimeAdded > aircraftBTimeAdded) {
            return -1;
        }
        else{
            return 1;
        }
        
        // we will never come here
        return 0;
    }
    
    // Passenger Large = Prio 0
    // Passenger Small = Prio 1
    // Cargo Large = Prio 2
    // Cargo Small = Prio 3
    self.determineNumericalPriority = function(aircraft){
        var priority = 0;
        
        switch(aircraft.type + "|" + aircraft.size) {
            case "Passenger|Large":
                priority = 0;
                break;
            case "Passenger|Small":
                priority = 1;
                break;
            case "Cargo|Large":
                priority = 2;
                break;
            case "Cargo|Small":
                priority = 3;
                break;
        }
        
        return priority;
    }
    
    self.numberOfAircraftPriorities = function(){
        return 4;
    }

}]);




// Queue management service [Enqueue/Dequeue]
// Use the array to avoid the minification problem
airTrafficControlApp.service('queueManagementService', ['$q', '$timeout', 'aircraftPriorityDeterminationService', function($q, $timeout, aircraftPriorityDeterminationService) {
    var self = this;
    this.queue = [];
    // Thsi array maintains the first aircraft of type, size in the array    
    this.queuePriorityMarkers = new Array(4);
    
    for (var queuePriorityMarkerIndex = 0; queuePriorityMarkerIndex < this.queuePriorityMarkers.length; queuePriorityMarkerIndex++){
        // no aircrafts yet, so mark all is invalid
        this.queuePriorityMarkers[queuePriorityMarkerIndex] = -1;
    }
      
    this.initialize = function(){
        return self.queue = [];
    };
        
    // Determine the number of items present in the queue
    this.numberOfItemsInQueue = function(){
        return self.queue.length;
    };
    
    this.insertIntoQueue = function (itemToInsert) {
        if (null == itemToInsert) {
            throw "Trying to add invalid null item";
        }
        
         // Add at the end of the queue to start with
        // before we determine the right position
        var itemPosition = self.queue.length;
        
        // Determine the numerical priority of this aircraft (0 to 3)
        var itemNumericalPriority = aircraftPriorityDeterminationService.determineNumericalPriority(itemToInsert);
        var foundPosition = false;
        
        for (var queuePriorityMarkerIndex = itemNumericalPriority + 1; queuePriorityMarkerIndex < this.queuePriorityMarkers.length; queuePriorityMarkerIndex++){
            // Determine the first aircraft that is of lower priority (Prio 0 is higher than Prio 1)
            
            if ((foundPosition === false) && (this.queuePriorityMarkers[queuePriorityMarkerIndex] != -1)){
                itemPosition = this.queuePriorityMarkers[queuePriorityMarkerIndex];
                foundPosition = true;
            }
            
            if ((foundPosition === true) && (this.queuePriorityMarkers[queuePriorityMarkerIndex] != -1)){
                // Increase the index of hte first occurance of all lower prio aircrafts by 1
                this.queuePriorityMarkers[queuePriorityMarkerIndex] = this.queuePriorityMarkers[queuePriorityMarkerIndex] + 1;
            }
        }
        
        if (this.queuePriorityMarkers[itemNumericalPriority] == -1) {
            // If this is the first aircraft of this type,size combination
            // store that information
            this.queuePriorityMarkers[itemNumericalPriority] = itemPosition;
        }
        
        
        // Insert item at the item position
        self.queue.splice(itemPosition, 0, itemToInsert);
        
        return itemPosition;
    };    
    
    // This is a async call   
    this.enqueueItem = function(item){
        var deferred = $q.defer();
        
        // emulate async
        $timeout(function(){
            var insertedAtPosition = self.insertIntoQueue(item);
                        
            deferred.resolve({
                "addedAtPosition": insertedAtPosition + 1,
                "totalSize": self.queue.length,
                "enqueuedItem": item
            });
            
        }, 100);
        
        return deferred.promise;
    };
    
    this.removeHighestPriorityItem = function () {
        // This is the first item
        // in the array
        
        var dequeuedAircraft = (self.queue.splice(0,1))[0];
        var itemNumericalPriority = aircraftPriorityDeterminationService.determineNumericalPriority(dequeuedAircraft);
        
        if ((self.queue.length == 0) ||
             (self.queue[0].size != dequeuedAircraft.size) || (self.queue[0].type != dequeuedAircraft.type)) {
            // if this is the last aircraft of this type,size, set the first occurance to be invalid
            self.queuePriorityMarkers[itemNumericalPriority] = -1;
        }
        
        for (var queuePriorityMarkerIndex = itemNumericalPriority + 1; queuePriorityMarkerIndex < this.queuePriorityMarkers.length; queuePriorityMarkerIndex++){
            if (this.queuePriorityMarkers[queuePriorityMarkerIndex] != -1){
                // decrease the index of al lower prio aircrafts
                this.queuePriorityMarkers[queuePriorityMarkerIndex] = this.queuePriorityMarkers[queuePriorityMarkerIndex] -1;
            }
        }
        
        return (dequeuedAircraft);
    };    
    
    this.dequeueItemWithHighestPriority = function(){
        var deferred = $q.defer();
        
        // Case: No items in queue
        if (self.numberOfItemsInQueue() === 0){
            deferred.reject("Invalid Operation: Attempt to dequeue from an empty Queue");
        }
        
        // To emulate async call
        $timeout(function(){
            var dequeuedItem = self.removeHighestPriorityItem();
            deferred.resolve (dequeuedItem); 
        }, 100);
        
        // Return the promise
        return deferred.promise;
    };
    
}]);
Aircraft application

How to run?
- On Mac
    - Clone repository
    - Open terminal and go to that directory
    - Type npm install
    - Type npm start
    - Open your web browser and go to the address http://localhost:8000/app/index.html#/


User Operations

- Boot: Initializes the system

- Enqueue: Enqueues the aircraft in the system. The user can specify the type of the aircraft and the size of the aircraft.

- Dequeue: Dequeues the highest priority item from the queue. Passenger aircraft are higher priority than Cargo. Large are higher proprity than small. After priorities, follow FIFO.

Algorithms

- Enqueue: Add at appropriate location. Queue is always sorted. Complexity O(1) -- depends on array implementation

- Dequeue: Remove the first element from the queue. Complexity O(1)

High level Code organization

- Home Page
    - Route in the routes.js
    - Uses the template home.html
        - Provides a button that the user can use to initialize the system
    - Controller in controller.js
        - Makes use of the Angular location service
        - Makes use of a custom systemBootService
        - Handles the click from the boot system button and redirects to the airTrafficControlAndStatus route
        

- Air Traffic Contorl and Status Page
    - Route in routes.js
    - Uses the template airTrafficControlAndStatus.html
        - Enqueue Panel
        - Dequeue Panel
        - Status Panel (Aircrafts in queue)
            - Uses custom directive aircraftDetails to show the details of each aircraft. This allows us to make changes to the way the aircraft details might be presented to the user without changing any other code
    - Controller in controller.js
        - User built in Angular timeout service
        - Uses custom systemBootService and queueManagementService
        - If the page was accessed without the system being booted, redirects to the system boot page
        - Enqueue
            - Two way binding for the aircraft size and aircraft type that are to be enqueued
            - Handles enqueue click and passes on the work to the queueManagementService
            - Shows footer in the panel for 10 seconds once the enqueue is successful (Two way binding)
        - Dequeue
            - If queue is empty, disable the dequeue button (two way binding)
            - Handles dequeue click and passes on the work to the queueManagementService to dequeue the highest priority item
            - Shows footer in the panel for 10 seconds once the dequeue is successful (Two way binding)
    
Custom Services
- systemBootService
    - Uses Angular location, q, and timeout service
    - Provides the ability to boot up the system (asynchronous call)
    
- queueManagementService
    - Uses Angular in build service q, timeout,
    - Uses custom systemBootService, aircraftComparisonService
    - Provides the ability to enqueue items
        - enqueue the aircraft at the correctly sorted order
        - Single queue is used
        - Maintain positions for the first occurance of each different priority of aircraft
        - When inserting, find the starting position of the next lower priority aircraft in queue
            - Insert at that position and update the bookkeeping variables
    - Provides the ability to dequeue the highest priority item in the queue
        - Remove the item at the head of the queue
        - Update the first occurance indices for each of the lower priority aircrafts
        - Dequeue is O(1)

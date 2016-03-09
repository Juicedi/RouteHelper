'use strict';
/**
 * @ngdoc function
 * @name reittiHelperApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the reittiHelperApp 
 */
angular.module('reittiHelperApp')
    .controller('MainCtrl', function (Places, $scope, $compile, $route) {

        $scope.se = true;
        $scope.but = true;
        $scope.ma = false;

        // gets users location when page is loaded
        $scope.getOrigin = function () {
            Places.getLocation();
        };

        $scope.refresh = function () {
            $route.reload();
        };

        // gets destinations coordinates and starts getRouteToDestination()
        $scope.getDestination = function () {
            console.log($scope.message);
            $('.searchContainer').css('display', 'none');
            $scope.but = false;
            var request = Places.destinationLocation($scope.message);
            request.then(function (response) {
                console.log(response.data.results[0].geometry.location);
                Places.setDestination(response.data.results[0].geometry.location);
                $scope.getRouteToDestination();
            }, function (error) {
                console.log(error.data);
            });
        };

        // gets route information from google and makes two buttons
        // to allow user choose between bus- and rail-routes
        $scope.getRouteToDestination = function () {
            var request = Places.getRoute();

            // request[0] has the bus-route information
            request[0].then(function (response) {
                console.log('bussi');
                console.log(response.data);

                if (response.data.status === 'OK') {
                    var resp = response.data.routes[0].legs[0];
                    var busses = [];
                    for (var i = 0; i < resp.steps.length; i++) {
                        if (resp.steps[i].travel_mode === 'TRANSIT') {
                            busses.push(resp.steps[i].travel_mode);
                        }
                    }
                    var switches = busses.length - 1;
                    var first = true;
                    for (i = 0; i < resp.steps.length; i++) {
                        if (resp.steps[i].travel_mode === 'TRANSIT' && first === true) {
                            $scope.dT = resp.steps[i].transit_details.departure_time.text;
                            first = false;
                        }
                    }
                    $scope.aT = resp.arrival_time.text;
                    if (resp.steps[0].travel_mode === 'WALKING') {
                        $scope.dist = resp.steps[0].distance.text;
                    }
                    // creates a button that will show the route info and initialize the google map
                    angular.element(document.getElementById('button1')).append($compile('<p>Vaihtoja: ' + switches + '<br>Pysäkillä: ' + $scope.dT + '<br>Määränpäässä: ' + $scope.aT + '<br>Pysäkille matkaa: ' + $scope.dist + '</p><button class="btn btn-default" ng-controller="MapCtrl" ng-click="initMap(\'BUS\')">Valitse bussireitti</button>')($scope));
                } else {
                    angular.element(document.getElementById('button1')).append($compile('<p>No possible bus-routes found.</p>')($scope));
                }
            }, function (error) {
                console.log(error.data);
            });
            // request[1] has the rail-route information
            request[1].then(function (response) {
                console.log('juna');
                console.log(response.data);

                if (response.data.status === 'OK') {
                    var resp = response.data.routes[0].legs[0];
                    var trains = [];
                    for (var i = 0; i < resp.steps.length; i++) {
                        if (resp.steps[i].travel_mode === 'TRANSIT') {
                            trains.push(resp.steps[i].travel_mode);
                        }
                    }
                    var switches = trains.length - 1;
                    var first = true;
                    for (i = 0; i < resp.steps.length; i++) {
                        if (resp.steps[i].travel_mode === 'TRANSIT' && first === true) {
                            $scope.dT = resp.steps[i].transit_details.departure_time.text;
                            first = false;
                        }
                    }
                    if (resp.steps[0].travel_mode === 'WALKING') {
                        $scope.dist = resp.steps[0].distance.text;
                    }
                    // creates a button that will show the route info and initialize the google map
                    angular.element(document.getElementById('button2')).append($compile('<p>Vaihtoja: ' + switches + '<br>Pysäkillä: ' + $scope.dT + '<br>Määränpäässä: ' + $scope.aT + '<br>Pysäkille matkaa: ' + $scope.dist + '</p><button class="btn btn-default" ng-controller="MapCtrl" ng-click="initMap(\'TRAIN\')">Valitse junareitti</button>')($scope));
                } else {
                    angular.element(document.getElementById('button2')).append($compile('<p>No possible train-routes found.</p>')($scope));
                }
            }, function (error) {
                console.log(error.data);
            });
        };
        $scope.getOrigin();
    });
'use strict';

angular.module('reittiHelperApp')
    .controller('MapCtrl', function (Places, $scope) {
        $scope.initMap = function (tMode) {
            $('.buttonContainer').addClass('ng-hide');
            $('.mapContainer').removeClass('ng-hide');
            var origin = Places.getOrigin();
            var destination = Places.getDestination();
            var request;
            var map = new google.maps.Map(document.getElementById('map'), {
                center: origin,
                scrollwheel: true,
                zoom: 10
            });

            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            });

            // Set destination, origin and travel mode.
            if (tMode === 'BUS') {
                request = {
                    destination: destination,
                    origin: origin,
                    travelMode: google.maps.TravelMode.TRANSIT,
                    transitOptions: {
                        modes: [google.maps.TransitMode.BUS]
                    },
                };
            } else {
                request = {
                    destination: destination,
                    origin: origin,
                    travelMode: google.maps.TravelMode.TRANSIT,
                    transitOptions: {
                        modes: [google.maps.TransitMode.TRAIN]
                    },
                };
            }

            // Pass the directions request to the directions service.
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    // Display the route on the map.
                    directionsDisplay.setDirections(response);
                }
            });
        };
    });
'use strict';

angular.module('reittiHelperApp').factory('Places', function ($http, $httpParamSerializer) {
    var origin = {
                lat: 60.2172214,
                lng: 24.7802027
            };
    var destination = {
                lat: 60.1686961,
                lng: 24.9383789
            };
    
    var placesFunctions = {}, params = {}, params2 = {}, params3 = {}, transitMode = 'bus';
    // Proxy is needed to get the json info from google places api!!!
    var proxy = 'http://users.metropolia.fi/~jussilat/Web/proxy.php?endpoint=';
    var urlStations = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    var urlDirections = 'https://maps.googleapis.com/maps/api/directions/json?';
    var urlGeocode = 'https://maps.googleapis.com/maps/api/geocode/json?';
    var key = 'AIzaSyDUTG34LGXSXBAY-trPXT6z3F_g1h05iYk';
    // var x = document.getElementById('viesti');

    placesFunctions.showPosition = function (position) {
        // x.innerHTML = 'oma paikkasi<br>Latitude: ' + position.coords.latitude + '<br>Longitude: ' + position.coords.longitude;
        origin.lat = position.coords.latitude;
        origin.lng = position.coords.longitude;
        params = {
            location: origin.lat + ',' + origin.lng,
            radius: 500,
            types: 'bus_station',
            key: key
        };
        params2 = {
            origin: origin.lat + ',' + origin.lng,
            destination: destination.lat + ',' + destination.lng,
            mode: 'transit',
            alternatives: 'yes',
            'transit_mode': 'bus',
            key: key
        };
        params3 = {
            origin: origin.lat + ',' + origin.lng,
            destination: destination.lat + ',' + destination.lng,
            mode: 'transit',
            alternatives: 'yes',
            'transit_mode': 'train',
            key: key
        };
    };
    placesFunctions.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(placesFunctions.showPosition);
        } else {
            // x.innerHTML = 'Geolocation is not supported by this browser.';
        }
    };
    placesFunctions.destinationLocation = function (message) {
        var paramGeo = {
            address: message,
            key: key
        };
        var dest = $http.get(proxy + encodeURIComponent(urlGeocode + $httpParamSerializer(paramGeo)));
        return dest;
    };
    placesFunctions.setDestination = function (responseData) {
        destination.lat = responseData.lat;
        destination.lng = responseData.lng;
        params2 = {
            origin: origin.lat + ',' + origin.lng,
            destination: destination.lat + ',' + destination.lng,
            mode: 'transit',
            'transit_mode': 'bus',
            key: key
        };
        params3 = {
            origin: origin.lat + ',' + origin.lng,
            destination: destination.lat + ',' + destination.lng,
            mode: 'transit',
            'transit_mode': 'rail',
            key: key
        };
    };

    placesFunctions.nearbyStations = function () {
        return $http.get(proxy + encodeURIComponent(urlStations + $httpParamSerializer(params)));
    };
    placesFunctions.getRoute = function () {
        var bussit = $http.get(proxy + encodeURIComponent(urlDirections + $httpParamSerializer(params2)));
        var junat = $http.get(proxy + encodeURIComponent(urlDirections + $httpParamSerializer(params3)));
        return [bussit, junat];
    };
    
    placesFunctions.getOrigin = function () {
        return origin;
    };
    placesFunctions.getDestination = function () {
        return destination;
    };
    placesFunctions.getTransitMode = function () {
        return transitMode;
    };

    return placesFunctions;
});
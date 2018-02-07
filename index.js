/** @description Represents a place in the list of places
    @constructor
    @param {string} name - The name of the place
    @param {string} placeid - The Google Maps placeid of the place
    @param {latlng} location - The latlng location of the place
*/
function Place (name, placeid, location) {
    const self = this;

    self.name = name;
    self.placeid = placeid;
    self.location =location;

}

/** @description The ViewModel for the application
    @constructor
*/
function PlacesModel () {
    const self = this;

    // currentInput holds the string by which the places are filtered
    self.currentInput = ko.observable('');
    
    // This array of places could be loaded from a server.
    self.places = [
	new Place('Somewhere','XXX', {lat: 48.864716, lng: 2.349014}),
	new Place('Elsewhere', 'XXX', {lat: 49.864716, lng: 2.849014})
    ];

    // Initially, there are no markers
    self.markers = [];

    // filteredPlaces is a computed observable returning the places
    // for which place.name includes the currentInput
    self.filteredPlaces = ko.computed(function () {
	return _.filter(self.places,
			function (place) {
			    return place.name.includes(self.currentInput());
			});
    });

    self.displayMarkers = function () {
	// First, remove old markers
	self.clearMarkers();
	// Create new markers and store them in self.markers
	self.markers = _.map(self.filteredPlaces(), function (place) {
	    var marker = new google.maps.Marker({
		position:  place.location,
		map: self.map
	    });
	    return marker;
	});
    }

    // function for clearing markers
    self.clearMarkers = function () {
	_.each(self.markers, function (marker) {
	    marker.setMap(null);
	});
    }
}

// in order to separate maps api calls and model, the model must be
// accessible in global context
const myModel = new PlacesModel();

/** @description Initializes the map on the page sets markers */
function initMap () {
    myModel.map = new google.maps.Map(document.getElementById("map"), {
	zoom: 14,
	center: {lat: 48.864716, lng: 2.349014}
    });
    myModel.displayMarkers();
}

ko.applyBindings(myModel);

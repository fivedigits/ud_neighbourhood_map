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
	new Place('Somewhere','XXX', 'here'),
	new Place('Elsewhere', 'XXX', 'there')
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
	_.each(self.filteredPlaces(), function (place) {
	    var marker = new google.maps.Marker({
		position:  {lat: 48.864716, lng: 2.349014},
		map: self.map
	    });
	    return marker;
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

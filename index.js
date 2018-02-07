/** @description Represents a place in the list of places
    @constructor
    @param {string} name - The name of the place
    @param {string} placeid - The Google Maps placeid of the place
    @param {latlng} location - The latlng location of the place
*/
function Place (name, placeid, location) {
    var self = this;

    self.name = name;
    self.placeid = placeid;
    self.location =location;

}

/** @description The ViewModel for the application
    @constructor
*/
function PlacesModel () {
    var self = this;

    // currentInput holds the string by which the places are filtered
    self.currentInput = ko.observable("");
    
    // This array of places could be loaded from a server.
    self.places = [
	new Place("Somewhere","XXX", "here"),
	new Place("Elsewhere", "XXX", "there")
    ];

    // filteredPlaces is a computed observable returning the places
    // for which place.name includes the currentInput
    self.filteredPlaces = ko.computed(function () {
	return _.filter(self.places,
			function (place) {
			    return place.name.includes(self.currentInput());
			});
    });

    self.filterMarkers = function () {
	console.log("code to filter markers");
    }

}

ko.applyBindings(new PlacesModel());

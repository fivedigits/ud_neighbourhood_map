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

    self.currentInput = ko.observable("");
    
    self.places = [
	new Place("Somewhere","XXX", "here"),
	new Place("Elsewhere", "XXX", "there")
    ];

    self.filteredPlaces = ko.computed(function () {
	return _.filter(self.places,
			function (place) {
			    return place.name.includes(self.currentInput());
			});
    });

}

ko.applyBindings(new PlacesModel());

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

    self.places = [
	new Place("Somewhere","XXX", "here"),
	new Place("Elsewhere", "XXX", "there")
    ];

}

ko.applyBindings(new PlacesModel());

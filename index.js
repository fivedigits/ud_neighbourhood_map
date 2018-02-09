/** @description Represents a place in the list of places
    @constructor
    @param {string} name - The name of the place
    @param {string} placeid - The Google Maps placeid of the place
    @param {latlng} location - The latlng location of the place
*/
function Place (name, fsid, location) {
    const self = this;

    self.name = name;
    self.fsid = fsid;
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
	new Place('Le Pré Verre', '4ba94161f964a52099183ae3', {lat: 48.8499854, lng: 2.3458762}),
	new Place('Aki','4b1c15a4f964a520d90124e3', {lat: 48.86614100000001, lng: 2.3352886}),
	new Place('Au P\'Tit Grec','4bca09f70687ef3ba719dbcc', {lat: 48.8427708, lng: 2.3495575}),
	new Place('Amorino','4bd5e7304e32d13aabb1c180', {lat: 48.8443279, lng: 2.3492272}),
	new Place('Academie de la biere', '58936c9fa19e903e160c1851', {lat: 48.839246, lng: 2.339092})
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

    self.populateMarkers = function () {
	// Create new markers and store them in self.markers
	self.markers = _.map(self.filteredPlaces(), function (place) {
	    var marker = new google.maps.Marker({
		title: place.name,
		position:  place.location,
		map: self.map,
		fsid: place.fsid
	    });
	    return marker;
	});

	// Bounce all markers on load
	_.each(self.markers, self.animateMarker);

	// now attach InfoWindows
	_.each(self.markers, function (marker) {
	    self.addInfoWindow(marker);
	});
    }

    // hides markers whose title is not in filteredPlaces
    self.filterMarkers = function () {
	var visiblePlaces = _.pluck(self.filteredPlaces(), 'name');

	_.each(self.markers, function(marker) {
	    if (visiblePlaces.includes(marker.title)) {
		marker.setMap(self.map)
	    } else {
		marker.setMap(null);
	    }
	});
    }

    // animates a single marker
    self.animateMarker = function (marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
	window.setTimeout(function () {
	    marker.setAnimation(null)
	}, 2000);
    }

    // asynchronously loads data form Foursquares and adds an info window to marker
    self.addInfoWindow = function (marker) {
	var url = 'https://api.foursquare.com/v2/venues/' + marker.fsid + '?client_id=D4LH0EQQE4AH1SGUDFHB4ZXPAMPIWKGQP1YSGLKVXA1VGPBG&client_secret=UZFUZQD21FC2A2MAT4SAEZRJVQIBK4IPGPL0WT1YRUYHS0JD&v=20170801'

	$.getJSON(url, function (data) {
	    var infoWindow = new google.maps.InfoWindow({
		content: self.formatFSResponseData(data)
	    });
	    marker.addListener('click', function () {
		infoWindow.open(self.map, marker);
		self.animateMarker(marker);
	    });
	})
	    .fail( function () {
		alert('Failed loading Foursquare data for ' + marker.title);
	    });
    }

    self.formatFSResponseData = function (data) {
	var venue = data.response.venue;
	var photo = venue.photos.groups[0].items[0];
	var content = '';

	content += '<h3>' + venue.name + '</h3>';
	content += 'Address : ' + venue.location.address + '<br>';
	if (venue.url) {
	    content += '<a href="' + venue.url + '">Homepage</a><br>';
	} else {
	    content += '<a href="' + venue.canonicalUrl + '">Foursquares Page</a></br>';
	}

	if (venue.description) {
	    content += '<p>' + venue.description + '</p>';
	} else {
	    content += '<p>There is no description available for this place.</p>';
	}

	if (photo) {
	    content += '<img src="' + photo.prefix + '300x400' + photo.suffix + '"></img>';
	}
	return content;
    }

    self.fitMapToMarkers = function () {
	// This bounds object is used to set center and zoom of map
	// Centering is only done initially, in order to show the
	// user the full neighbourhood map at all times
	bounds = new google.maps.LatLngBounds();
	// Adjust the bounds to fit all markers
	_.each(self.markers, function (marker) {
	    bounds.extend(marker.position);
	});
    
	// Finally set the center and bound of the map
	self.map.setCenter(bounds.getCenter());
	self.map.fitBounds(bounds);
    }

    // This function is called, if a list item is clicked
    // It uses the Maps API to trigger the usual click
    // event on the marker corresponding to place
    self.placeTriggerMarker = function (place) {
	var marker = _.findWhere(self.markers, {title: place.name});
	google.maps.event.trigger(marker, 'click', {});
    }
}

// in order to separate maps api calls and model, the model must be
// accessible in global context
const myModel = new PlacesModel();

/** @description Initializes the map on the page sets markers */
function initMap () {
    // using dummy data for initial map display, map is later recentered
    myModel.map = new google.maps.Map(document.getElementById("map"), {
	zoom: 14,
	center: {lat: 48.864716, lng: 2.349014}
    });

    // fills the markers array in the view model
    myModel.populateMarkers();

    // fits the map to show all markers
    myModel.fitMapToMarkers();
}

ko.applyBindings(myModel);

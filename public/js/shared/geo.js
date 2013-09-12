var container;

$(document).on("pageinit", "#userSearch", function() {
	$("#showMap").click(function() {
		container = $("#info");
		container.text("");
		getLocation();
	});
});

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		container.append("Geolocation is not supported by this browser.");
	}
}

function showPosition(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	latlon = new google.maps.LatLng(lat, lon)
	mapholder = document.getElementById('map')
	mapholder.style.height = '500px';
	mapholder.style.width = '800px';

	var myOptions = {
		center : latlon,
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		mapTypeControl : false,
		navigationControlOptions : {
			style : google.maps.NavigationControlStyle.SMALL
		}
	};
	var map = new google.maps.Map(document.getElementById("map"),
			myOptions);
	var marker = new google.maps.Marker({
		position : latlon,
		map : map,
		title : "You are here!"
	});
}

function showError(error) {
	switch (error.code) {
	case error.PERMISSION_DENIED:
		container.append("User denied the request for Geolocation.");
		break;
	case error.POSITION_UNAVAILABLE:
		container.append("Location information is unavailable.");
		break;
	case error.TIMEOUT:
		container.append("The request to get user location timed out.");
		break;
	case error.UNKNOWN_ERROR:
		container.append("An unknown error occurred.");
		break;
	}
}
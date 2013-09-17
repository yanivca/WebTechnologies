$(document).on("pageshow", "#userSearch", function() {
	getLocation();
});

function getLocation() {
	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		navigator.geolocation
				.getCurrentPosition(positionSuccess, positionError);
	} else {
		$("#map").text("Your browser does not support geolocation");
	}
}

// handle geolocation api errors
function positionError(error) {
	var errors = {
		1 : "Authorization fails", // permission denied
		2 : "Can\'t detect your location", // position unavailable
		3 : "Connection timeout" // timeout
	};
	var msg = "Error:" + errors[error.code];
	$("#info").addClass("error").text(msg);
}

function positionSuccess(position) {
	var map;
	var doc = $(".ui-page-active");
	var connects = {};
	var markers = {};

	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	var latlng = new google.maps.LatLng(lat, lng);

	var mapholder = $("#map");
	var height = doc.innerHeight() - mapholder.position().top - 15;
	mapholder.height(height);

	var myOptions = {
		size : {
			width : mapholder.width(),
			height : height
		},
		center : latlng,
		zoom : 17,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		mapTypeControl : false,
		navigationControlOptions : {
			style : google.maps.NavigationControlStyle.SMALL
		}
	};
	map = new google.maps.Map(document.getElementById("map"), myOptions);
	google.maps.event.trigger(map, "resize");

	var userMarker = new google.maps.Marker({
		position : latlng,
		map : map
	});

	var userInfowindow = new google.maps.InfoWindow();
	userInfowindow.setContent("You are here!");
	userInfowindow.open(map, userMarker);

	window.onresize = function() {
		height = doc.innerHeight() - mapholder.position().top - 15;
		mapholder.height(height);
		map.panTo(latlng);
	};

	socket.on("load:coords", function(data) {
		// remember users id to show marker only once
		if (!(data.id in connects)) {
			setMarker(data, map, markers);
		}
		connects[data.id] = data;
		connects[data.id].updated = $.now();
	});

	// delete inactive users every 15 sec
	setInterval(function() {
		for (ident in connects) {
			if ($.now() - connects[ident].updated > 15000) {
				delete connects[ident];
				markers[ident].setMap(null);
			}
		}
	}, 15000);
}

// showing markers for connections
function setMarker(data, map, markers) {
	for (i = 0; i < data.coords.length; i++) {
		var latlng = new google.maps.LatLng(data.coords[i].lat,
				data.coords[i].lng);

		var marker = new google.maps.Marker({
			position : latlng,
			map : map,
			icon : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
		});

		var infowindow = new google.maps.InfoWindow();
		infowindow.setContent(data.userName);
		infowindow.open(map, marker);

		markers[data.id] = marker;

		google.maps.event.addListener(marker, 'click', function() {
			getUserResult(data.id);
		});
	}
}

function getUserId() {
	response = $.ajax({
		url : "../users/isloggedin/",
		type : "GET",
		async : false
	});
	return response.responseJSON.userId;
}

function getUserName(userId) {
	response = $.ajax({
		url : "../users/" + userId,
		type : "GET",
		async : false
	});
	return response.responseJSON.data[0].username;
}

function getUserResult(userId) {
	var resDeferred = getSearchById(userId);
	resDeferred.done(function(response) {
		if (response.status)
			$.mobile.changePage("#results");
	})
}

function sendCoords(position) {
	var userId = myUserId;
	var userName = myFirstName + " " + myLastName;

	var lat = position.coords.latitude;
	var lng = position.coords.longitude;

	var sentData = {
		id : userId,
		userName : userName,
		coords : [ {
			lat : lat,
			lng : lng,
		} ]
	}
	socket.emit("send:coords", sentData);
}
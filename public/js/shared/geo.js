function getLocation() {
	// get user id
	var userId;
	$.getJSON('../users/isloggedin/', function(data) {
		userId = data.userId;
	});
	var socket = io.connect("/");
	var map;

	var info = $("#info");
	var doc = $(document);

	var sentData = {};
	var connects = {};
	var markers = {};
	var active = false;

	socket.on("load:coords", function(data) {
		// remember users id to show marker only once
		if (!(data.id in connects)) {
			setMarker(data);
		}

		connects[data.id] = data;
		connects[data.id].updated = $.now(); // shorthand for (new
												// Date).getTime()
	});

	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		navigator.geolocation
				.getCurrentPosition(positionSuccess, positionError);
	} else {
		$("#map").text("Your browser does not support geolocation");
	}

	function positionSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var latlng = new google.maps.LatLng(lat, lng);
		mapholder = $("#map");
		mapholder.height($(window).height());
		mapholder.width($(window).width());

		var myOptions = {
			center : latlng,
			zoom : 14,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			mapTypeControl : false,
			navigationControlOptions : {
				style : google.maps.NavigationControlStyle.SMALL
			}
		};
		map = new google.maps.Map(document.getElementById("map"), myOptions);
		var userMarker = new google.maps.Marker({
			position : latlng,
			map : map,
			title : "You are here!"
		});

		// send coords on when user is active
		doc.on("mousemove", function() {
			active = true;

			sentData = {
				id : userId,
				active : active,
				coords : [ {
					lat : lat,
					lng : lng,
				} ]
			}
			socket.emit("send:coords", sentData);
		});
	}

	doc.bind("mouseup mouseleave", function() {
		active = false;
	});

	// showing markers for connections
	function setMarker(data) {
		for (i = 0; i < data.coords.length; i++) {
			alert("Someone just entered");
			var newlatlng = new google.maps.LatLng(data.coords[i].lat,
					data.coords[i].lng);
			var marker = new google.maps.Marker({
				position : newlatlng,
				map : map,
				title : data.id
			});
			markers[data.id] = marker;

			google.maps.event.addListener(marker, 'click', function() {
				getUser(data.id);
			});
		}
	}

	// handle geolocation api errors
	function positionError(error) {
		var errors = {
			1 : "Authorization fails", // permission denied
			2 : "Can\'t detect your location", // position unavailable
			3 : "Connection timeout" // timeout
		};
		showError("Error:" + errors[error.code]);
	}

	function showError(msg) {
		info.addClass("error").text(msg);
	}

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

function getUser(userId) {
	var resDeferred = getSearchById(userId);
	resDeferred.done(function(response) {
		if (response.status)
			$.mobile.changePage("#results");
	})
}
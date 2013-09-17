/**
 * Created with JetBrains PhpStorm. User: elad Date: 9/6/13 Time: 5:05 PM To
 * change this template use File | Settings | File Templates.
 */

var loginCheck = true;
var socket = io.connect("/");

socket.on("load:notif", function(senderString) {
    var sender = JSON.parse(senderString);
	if (sender && getUserId() == sender.from) {
        showNotificationPopup(sender);
	}
});



function openRateUserDialog(data) {
    var dialogElement = getDialog();
    var unlikeButton = $('<a class="rate-btn unlike" data-role="none">-</a>');
    var likeButton = $('<a class="rate-btn like" data-role="none">+</a>')
    var template = [
        "Please rate ", data.firstName, " ", data.lastName
    ].join("");
    dialogElement.find("#dialog-tooltip").text("Rate user");
    dialogElement.find("#dialog-title").text(template);
    //dialogElement.find("#dialog-content").text(template);
    dialogElement.find("#dialog-content").append(likeButton).append(unlikeButton);
    dialogElement.one("click", ".rate-btn", function(event) {
        var params = "userId=" + data.userId + "&isPositiveFeedback=";
        var target = event.target;
        params += $(target).hasClass("like");
        var promise = sendRequest("../users/rateuser", params, "POST");
        promise.always(function() {
            closeDialog();
            $.mobile.navigate("main");
        });
    });

    openDialog();
}

function showNotificationPopup(data) {
    var dialogElement = getDialog();
    var ignoreButton = $('<a data-role="button" data-rel="back" data-theme="b">Ignore</a>');
    var redirectButton = $('<a href="notificationDetails" data-role="button" data-theme="b">Watch</a>')
    redirectButton.attr("data-id", data.id);
    var template = [
        data.firstName, " ", data.lastName, " would like to ", data.type, " ", data.amount, " Bitcoins"
    ].join("");
    dialogElement.find("#dialog-tooltip").text("New Request");
    dialogElement.find("#dialog-content").text(template);
    dialogElement.find("#dialog-content").append(ignoreButton).append(redirectButton);
    dialogElement.one("click", "a[data-role=button]", function() {
        closeDialog();
    })
    openDialog();
}

function getDialog() {
    return $("#popupDialog");
}
function openDialog() {
    $("#dialogButton").click();
    var dialog = getDialog();
    dialog.trigger('create');
    dialog.attr("style","");
}

function closeDialog() {
    var dialog = getDialog();
    dialog.dialog('close');
    dialog.on("pagehide", function() {
        dialog.find("#dialog-tooltip").html("");
        dialog.find("#dialog-title").html("");
        dialog.find("#dialog-content").html("");
        //dialog.css("display","none");
    });
}

function showLoader(message) {
	$.mobile.showPageLoadingMsg(message);
}
function hideLoader() {
	$.mobile.hidePageLoadingMsg();
}

function initSignupComponent() {
	$(document).on("click", "#registerButton", function() {
		trySignUp();
	});
	$(document).on("click", "#registerCancel", function() {
		$("#registerError").text("");
	})
}

function initLoginComponent() {
	$(document).on("click", "#loginButton", function() {
		login();
	});
	$(document).on("click", "#loginCancel", function() {
		$("#loginError").text("");
	})
}

function initNotificationCreate() {

	$("#notificationCreateSubmit").on("click", function() {
		var userId = $("#notificationCreateId").val();
		var amount = $("#notificationCreateAmount").val();
		var rate = $("#notificationCreateRate").val();
		var type = $("#notificationCreateType").val();

		var deferred = tryNotificationCreate(userId, amount, rate, type);
		deferred.done(function(response) {
            var notificationObject = {
                from: userId,   // the current user is the sender to the user that receives the notification
                firstName: myFirstName,
                lastName: myLastName,
                amount: amount,
                rate: rate,
                type: type,
                id: response.id
            }
			socket.emit("send:notif", JSON.stringify(notificationObject));
			window.history.go(-2);
//            $.mobile.navigate("userSearch");
			// $.mobile.back();
		})
	});

}

function login(username, password) {

	var loggedIn = isLoggedIn();
	loggedIn.fail(function() {
		var deferred = tryLogin(username, password);

		deferred.done(function(response) {
			$.mobile.changePage("main");
		}).always(function() {
		});
	}).done(function(response) {
		$.mobile.changePage("main");
	});
}

function initPublishComponent() {

	$("#broadcastPublishSubmit").on("click", function() {
		var amount = $("#broadcastPublishAmount").val();
		var rate = $("#broadcastPublishRate").val();
		var type = $("#broadcastPublishType").val();

		tryPublishBroadcast(amount, rate, type);
	})
}

$(document).on("pageinit", "#loginDialog", function() {
	initLoginComponent();
});

$(document).on("pageinit", "#registerDialog", function() {
	initSignupComponent();
});

$(document).on("pageinit", "#index", function() {
	loginCheck = false;
});

$(document).on("pageinit", "#main", function() {
	var loggedIn = isLoggedIn();

	loggedIn.fail(function(response) {
		window.location.href = "index";
	})
});

$(document).on("pageinit", "#userSearch", function() {
	$("#searchTopNearestSubmit").click(function() {
		var numItems = $("#searchTopNearestAmount").val();
		var maxDistance = $("#searchTopNearestRange").val();

		var resDeferred = getSearchByRange(numItems, maxDistance);
		resDeferred.done(function(response) {
			if (response.status)
				isResults = true;
			$.mobile.changePage("#results");
		})
	});
});

$(document).on("pageinit", "#userSearchMinRating", function() {
	$("#searchMinRatingSubmit").click(function() {
		var minRating = $("#searchMinRatingRating").val();

		var resDeferred = getSearchMinRating(minRating);
		resDeferred.done(function(response) {
			if (response.status)
				$.mobile.changePage("#results");
		})
	});
});

$(document).on("pageinit", "#userSearchById", function() {
	$("#searchByIdSubmit").click(function() {
		var userId = $("#searchByIdId").val();

		var resDeferred = getSearchById(userId);
		resDeferred.done(function(response) {
			if (response.status)
				$.mobile.changePage("#results");
		})
	});
});

$(document).on("pageinit", "#userSearchAll", function() {
	getSearchAll();
});

$(document).on("pageinit", "#notification", function() {
	getNotifications();
});

$(document).on("pageinit", "#broadcasts", function() {
	getBroadcasts();
});

$(document).on("pageinit", "#broadcastGetAll", function() {
	getBroadcasts();
});

$(document).on("pageinit", "#broadcastPublish", function() {
	initPublishComponent();
});

$(document).on("pageinit", "#notificationCreate", function() {
	initNotificationCreate();
});

$(document).on("pageinit", function() {
	$("#logout").one("click", function() {
		logout();
	});

	if (loginCheck) {
		var loggedIn = isLoggedIn();

		loggedIn.fail(function(response) {
			window.location.href = "index";
		});
	}

});

$(document).on("pageshow", function() {
	var loggedIn = isLoggedIn();
	loggedIn.done(function(response) {
		if (navigator.geolocation) {
			setInterval(function() {
				navigator.geolocation.getCurrentPosition(sendCoords);
			}, 5000);
		}
	});
});

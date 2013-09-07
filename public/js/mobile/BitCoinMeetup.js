/**
 * Created with JetBrains PhpStorm.
 * User: elad
 * Date: 9/6/13
 * Time: 5:05 PM
 * To change this template use File | Settings | File Templates.
 */

var loginCheck = true;
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

$(document).ready(function() {
    $("#logout").click(function() {
        logout();
    });

    if (loginCheck) {
        var loggedIn = isLoggedIn();

        loggedIn.fail(function(response) {
            window.location.href = "index";
        });
    }

})

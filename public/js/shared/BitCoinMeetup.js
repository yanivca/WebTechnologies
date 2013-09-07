/**
 * Created with JetBrains PhpStorm.
 * User: elad
 * Date: 9/6/13
 * Time: 6:51 PM
 * To change this template use File | Settings | File Templates.
 */
function sendRequest(url, params, method) {
    showLoader("Please wait");
    method = method || "GET";
    return $.ajax({
        url: url,
        type: method,
        data: params
    }).always(function(){
            hideLoader();
        });
}

function tryLogin(username, password) {
    username = username || $("#loginUsername").val();
    password = password || $("#loginPassword").val();
    var requestDeferred, retDeferred = new $.Deferred();
    $("#loginError").text("").removeClass();

    if (!username || !password) {
        $("#loginError").text("Invalid username/password").addClass("alert alert-error");
        retDeferred.reject();
    }

    if (!username) {
        $("#loginError").text("Username missing").addClass("alert alert-error");
        retDeferred.reject();
    }

    if (retDeferred.state() != "rejected") {
        requestDeferred = sendRequest("/users/login/" + username + "/" + password, "GET");
        requestDeferred.always(function(response) {
            if (response && response.success) {
                $("#loginUsername").val("");
                $("#loginPassword").val("");
                retDeferred.resolve(response);
            } else {
                var message = "Login error";
                if (response && response.msg) {
                    message = response.msg;
                }
                retDeferred.reject(response);
                $("#loginError").text(message).addClass("alert alert-error");
            }
        });
    }

    return retDeferred;
}

function trySignUp() {
    var firstname = $("#registerFirstName").val();
    var lastname = $("#registerLastName").val();
    var username = $("#registerUsername").val();
    var password = $("#registerPassword").val();
    var confirmpassword = $("#registerPasswordConfirm").val();
    var usertypeBuyer = $("#registerTypeBuyer").val();
    var usertypeSeller = $("#registerTypeSeller").val();
    var usertype = new Array();

    //var emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
    var requestDeferred, retDeferred = new $.Deferred();
    var params;
    $("#registerError").text("").removeClass();

    if (!username || !password) {
        $("#registerError").text("Invalid username/password").addClass("alert alert-error");
        retDeferred.reject();
    }
    else if (!firstname || !lastname) {
        $("#registerError").text("first name or last name are empty").addClass("alert alert-error");
        retDeferred.reject();
    }
    else if (confirmpassword != password) {
        $("#registerError").text("confirm password and password are not the same ").addClass("alert alert-error");
        retDeferred.reject();
    }
    else if (!username) {
        $("#registerError").text("Username missing").addClass("alert alert-error");
        retDeferred.reject();
    }

    if (!usertypeBuyer && ! usertypeSeller) {
        $("#redisterError").text("Must specify at least one of the followings: Seller/Buyer");
        retDeferred.reject();
    } else {
        if (usertypeBuyer)
            usertype.push("buyer");
        if (usertypeSeller)
            usertype.push("seller");
    }

    if (retDeferred.state() != "rejected") {
        params = "firstName=" + firstname + "&lastName=" + lastname + "&username=" + username + "&password=" + password;
        for (var i=0; i < usertype.length; i++) {
            params += "&type[]=" + usertype[i];
        }
        requestDeferred = sendRequest("../users/subscribe", params, "POST");
        requestDeferred.always(function(response) {
            //response = $.parseJSON(response);
            if (response && response.success) {
                retDeferred.resolve(response);
                login(username,password);
            } else {
                var message = "signup error";
                if (response && response.msg) {
                    message = response.msg;
                }
                retDeferred.reject(response);
                $("#registerError").text(message).addClass("alert alert-error");
            }
        });
    }

    return retDeferred;
}

function validateLoggedInUser() {
    var isUserLoggedIn = isLoggedIn();
    if (!isUserLoggedIn) {
        $.mobile.changePage("index.htm");
    }

    return isUserLoggedIn;
}

function isLoggedIn() {

    var loggedin = false;
    var retDeferred = new $.Deferred();

    var requestDeferred = sendRequest("../users/isloggedin",null, "GET");
    requestDeferred.always(function(response) {
        if (response && response.userId) {
            retDeferred.resolve(response);
        } else {
            retDeferred.reject(response);
        }
    });

    return retDeferred;
}

function logout() {
    var requestDeferred = sendRequest("../users/logout", null, "GET");
    requestDeferred.always(function(response) {
        window.location.href = "index";
    });
}

function getSearchByRange(numItems, maxDistance) {

    var requestDeferred = sendRequest("../users/near/" + numItems + "/" + maxDistance, null, "GET");
    requestDeferred.fail(function(response) {
        // Show error
    }).done(function(response) {
            populateSearchResults(response);
        });
    return requestDeferred;
}

function getSearchMinRating(minRating) {

    var requestDeferred = sendRequest("../users/minRating/" + minRating, null, "GET");
    requestDeferred.fail(function(response) {
        // Show error
    }).done(function(response) {
            populateSearchResults(response);
        });
    return requestDeferred;
}

function populateSearchResults(response) {
    var container = $("#resultsContent");
    container.text("");
    if (response.count == 0 || !response.data) {
        container.append("No search matches found");
    } else {
        container.append("<div data-role=\"controlgroup\">");
        for (var i=0; i < response.count; i++) {
            container.append("<a data-role=\"button\" data-id=\"" + response.data[i]._id + "\">" + response.data[i].username + "</a>");
        }
        container.append("</div>");
    }

    container.append("<a data-role=\"button\" data-rel=\"back\" data-icon=\"back\" rel=\"external\">Back</a>");
}
Object.defineProperty(window, "myLastName", {
    get: function() {return localStorage.getItem("myLastName") || "" },
    set: function(name) { localStorage.setItem("myLastName", name) }
});
Object.defineProperty(window, "myFirstName", {
    get: function() {return localStorage.getItem("myFirstName") || "" },
    set: function(name) { localStorage.setItem("myFirstName", name) }
});
Object.defineProperty(window, "myUserId", {
    get: function() {return localStorage.getItem("myUserId") || "" },
    set: function(id) { localStorage.setItem("myUserId", name) }
});

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
        requestDeferred = sendRequest("../users/login/" + username + "/" + password);
        requestDeferred.always(function(response) {
            if (response && response.success) {
                $("#loginUsername").val("");
                $("#loginPassword").val("");

                myFirstName = response.data.firstName;
                myLastName = response.data.lastName;
                myUserId = response.data.userId;
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

    return retDeferred.promise();
}

function trySignUp() {
    var firstname = $("#registerFirstName").val();
    var lastname = $("#registerLastName").val();
    var username = $("#registerUsername").val();
    var password = $("#registerPassword").val();
    var confirmpassword = $("#registerPasswordConfirm").val();
    var usertypeBuyer = $("#registerTypeBuyer").is(":checked");
    var usertypeSeller = $("#registerTypeSeller").is(":checked");
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

function tryNotificationCreate(userid, amount, ratio, type) {

    var retDeferred = new $.Deferred();
    if (!userid) {
        $("#notificationCreateError").text("Missing user ID");
        retDeferred.reject();
    }

    if (!amount) {
        $("#notificationCreateError").text("Missing amount");
        retDeferred.reject();
    }

    if (!ratio) {
        $("#notificationCreateError").text("Missing ratio");
        retDeferred.reject();
    }
    
    if (!type) {
        $("#notificationCreateError").text("Must specify type");
        retDeferred.reject();
    }

    if (retDeferred.state() != "rejected") {
        var params = "to=" + userid + "&bitcoinsAmount=" + amount + "&rate=" + ratio + "&type=" + type;

        var requestDeferred = sendRequest("../notifications/notify",params, "POST");
        requestDeferred.always(function(response) {
            if (response && response.success) {
                retDeferred.resolve(response);
            } else {
                retDeferred.reject(response);
            }
        });
    }

    return retDeferred;
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

function getSearchById(userId) {

    var requestDeferred = sendRequest("../users/" + userId, null, "GET");
    requestDeferred.fail(function(response) {
        // Show error
    }).done(function(response) {
            populateSearchResults(response);
        });
    return requestDeferred;
}

function getSearchAll() {

    var requestDeferred = sendRequest("../users", null, "GET");
    requestDeferred.fail(function(response) {
        // Show error
    }).done(function(response) {
            populateSearchResults(response);
        });
    return requestDeferred;
}

function getNotifications() {
    var requestDeferred = sendRequest("../notifications", null, "GET");
    requestDeferred.fail(function(response) {
        // Show error
    }).done(function(response) {
            populateNotifications(response);
        });
    return requestDeferred;
}

function getBroadcasts() {
    var requestDeferred = sendRequest("../broadcasts", null, "GET");
    requestDeferred.fail(function(response) {
        // Show error
    }).done(function(response) {
            populateBroadcasts(response);
        });
    return requestDeferred;
}

function populateSearchResults(response) {
    var container = $("#innerResults");
    var html;

    container.text("");

    if (response.count == 0 || !response.data) {
        container.append("No search matches found");
        container.trigger("create");
    } else {
        for (var i=0; i < response.count; i++) {
            html = $("<a data-role=\"button\" data-context=\"userToNotify\" id=\"" + response.data[i]._id + "\">" + response.data[i].username + "</a>");
            container.append(html);
        }
    }

    html = $("<a data-role=\"button\" data-rel=\"back\" data-icon=\"back\" rel=\"external\">Back</a>");
    container.append(html);
    container.trigger("create");

    $("a[data-context='userToNotify']").on("click", function() {
        var id = this.id;

        var params = {id: id};
        post_to_url("notificationCreate", params, "POST");
    })
}

function populateNotifications(response) {
    var container = $("#innerResults").addClass("texts");

    container.text("");

    if (response.count == 0 || !response.data) {
        container.append("No Notifications");
        container.trigger("create");
    } else {
        container.append("<div data-role=\"controlgroup\" id=\"innerResults\"></div>");
        for (var i=0; i < response.count; i++) {
            container.append("<a data-context=\"notificationToRead\" data-role=\"button\" data-id=\"" + response.data[i]._id + "\">" + response.data[i].type + "ing " + response.data[i].bitcoinsAmount + " Bitcoins</a>");
        }
    }

    container.append("<a data-role=\"button\" data-rel=\"back\" data-icon=\"back\" rel=\"external\">Back</a>");
    container.trigger("create");

    $("a[data-context='notificationToRead']").on("click", function() {
        var id = this.id;

        var params = {id: id};
        post_to_url("notificationDetails", params, "POST");
    })

}

function populateBroadcasts(response) {
    var container = $("#innerResults").addClass("texts");
    var html;

    container.text("");

    if (response.count == 0 || !response.data) {
        container.append("No Broadcasts");
        container.trigger("create");
    } else {
        for (var i=0; i < response.count; i++) {
            html = $("<a data-role=\"button\" id=\"" + response.data[i]._id + "\">" + response.data[i].type + "ing " + response.data[i].bitcoinsAmount + " Bitcoins</a>");
            container.append(html);
        }
    }

    html = $("<a data-role=\"button\" data-rel=\"back\" data-icon=\"back\" rel=\"external\">Back</a>");
    container.append(html);
    container.trigger("create");

}

function tryPublishBroadcast(amount, ratio, type) {
    var requestDeferred, retDeferred = new $.Deferred();

    if (!amount) {
        $("#publishError").text("Must specify amount");
        retDeferred.reject();
    }

    if (!ratio) {
        $("#publishError").text("Must specify ratio");
        retDeferred.reject();
    }

    if (!type) {
        $("#publishError").text("Must specify type");
        retDeferred.reject();
    }

    if (retDeferred.state() != "rejected") {
        var params = "bitcoinsAmount=" + amount + "&rate=" + ratio + "&type=" + type;
        requestDeferred = sendRequest("../broadcasts/publish", params, "POST");
        requestDeferred.always(function(response) {
            if (response && response.success) {
                $("#publishError").text("Broadcast updated");
                retDeferred.resolve(response);
            } else {
                var message = response.message || "General error";
                $("#publishError").text(message);
                retDeferred.reject(response);
            }
        })
    }
}

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
/**
 * Created with JetBrains PhpStorm.
 * User: elad
 * Date: 9/6/13
 * Time: 5:05 PM
 * To change this template use File | Settings | File Templates.
 */

function login() {
	$.get('../users/login/'+$("#loginUser").val()+'/'+$("#loginPass").val(), function(response) {
		  	if (response.success == true) {
		  		self.location = "main";
		  	}
		  	else {
		  		alert(response.msg);
		  	}
		});
}

function register() {
	var type;
	if ($('[name="buy"]').is(':checked') && $('[name="sell"]').is(':checked')) {
		type=[ "buyer", "seller" ];
	}
	else if ($('[name="buy"]').is(':checked')) {
		type = [ "buyer" ];
	}
	else if ($('[name="sell"]').is(':checked')) {
		type = [ "seller" ];
	}
	var request = $.ajax({
	  url: "../users/subscribe",
	  type: "POST",
	  data: {firstName : $("#first").val(), lastName : $("#last").val(),
		  username: $("#regUser").val(), password: $("#regPass").val(), type : type},
	  dataType: "json"
	});
	 
	request.done(function(response) {
	  	if (typeof response.msg === "undefined") {
	  		self.location = "index";
	  	}
	  	else {
	  		alert(response.msg);
	  	}
	});
	 
	request.fail(function(jqXHR, textStatus) {
	  alert( "Request failed: " + textStatus );
	});
}

function searchById() {
    $.getJSON('../users/'+$("#id").val(), function(data) {
        $("#div-my-table").text("<table>");

        $.each(data, function(i, item) {
            $("#div-my-table").append("<tr><td>" + item +"</td></tr>");
        });

        $("#div-my-table").append("</table>");

    });
}
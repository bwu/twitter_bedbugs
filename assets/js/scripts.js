$(document).ready(function() {

	$('body').on('click', '#run', function(e){
        validName = validUserName($('#user_name').val());
        if (validName) {
        	$.post('./models/get_tweets.php', {
        		user_name:validName
        	}, function(resp){
        		$('#results_container').show();
        		populateResults(resp, function(){});
        	});
        } else {
        	console.log('invalid');
        }
		e.preventDefault();
	});

});

function validUserName(user_name) {
	if (user_name) {
		return $.trim(user_name)
	}
	return false;
}

function postToApprove(action, id) {
	$.post('./models/approve.php', {action:action, id:id}, function(resp) {
	}, 'json');
}

function populateResults(response, responseCallback) {
    $('#results').html('');
    var item_source = $("#item_template").html();
    var item_template = Handlebars.compile(item_source);
    for (var item in response) {
        $('#results').append(item_template(response[item]));
    }
	if(responseCallback) //If a callback function is set
		responseCallback(true);
}
$(document).ready(function(){
	$.ajax({
		url: "/register",
		success: function (data, status, jqXHR) {
			$('#form').append(data);
				$('#repo-save').fadeIn('slow');
		}
	});
});
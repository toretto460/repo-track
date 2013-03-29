$(document).ready(function(){
	$.ajax({
		url: "/repo/new",
		success: function (data, status, jqXHR) {
			$('#modal-components').append(data);
		}
	});
});
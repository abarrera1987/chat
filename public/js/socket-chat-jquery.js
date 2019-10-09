var paramsJquery = new URLSearchParams(window.location.search);
var nombre = paramsJquery.get('nombre');
var sala = paramsJquery.get('sala');
/**
 * Referencias de jquery
 */

divUsuarios = $("#divUsuarios");
formEnviar = $("#formEnviar");
txtMensaje = $("#txtMensaje");
divChatbox = $("#divChatbox");


function renderizarPersonas(personas) {

	console.log(personas);

	var html = '';

	html += '<li>';
	html += '	<a href="javascript:void(0)" class="active"> Chat de <span> ' + paramsJquery.get('sala') + '</span></a>';
	html += '</li>';

	for (var i = 0; i < personas.length; i++) {

		html += '<li>';
		html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
		html += '</li>';
	}

	divUsuarios.html(html);

}




function renderizarMensajes(mensaje, yo) {
	
	var html = '';
	var fecha = new Date(mensaje.fecha);
	var hora = fecha.getHours()+":"+fecha.getMinutes();
	if (yo) {
		html += '<li class="reverse">';
		html += '	<div class="chat-content">';
		html += '		<h5>' + mensaje.usuario + '</h5>';
		html += '		<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
		html += '	</div>';
		html += '	<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
		html += '	</div>';
		html += '	<div class="chat-time">'+hora+'</div>';
		html += '</li>';
	} else {
		html += '<li>';
		html += '	<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />';
		html += '	</div>';
		html += '	<div class="chat-content">';
		html += '		<h5>' + mensaje.usuario + '</h5>';
		html += '		<div class="box bg-light-info">' + mensaje.mensaje + '</div>';
		html += '	</div>';
		html += '	<div class="chat-time">'+hora+'</div>';
		html += '</li>';		
	}

	divChatbox.append(html);
	
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}



divUsuarios.on("click", "a", function () {

	var id = $(this).data('id');
	if (id) {
		console.log(id)
	}

})

formEnviar.on("submit", function (e) {

	e.preventDefault();

	if (!txtMensaje.val()) {
		return false;
	}

	socket.emit("crearMensaje", {

		nombre,
		mensaje: txtMensaje.val()

	}, function (mensaje) {
		renderizarMensajes(mensaje, true);
		txtMensaje.val('').focus();
		scrollBottom();
	})

})
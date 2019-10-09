var socket = io();

let params = new URLSearchParams(window.location.search);
/**
 * si no existe el parametro lo devuelvo al home
 */
if (!params.has('nombre') || !params.has('sala')) {

	window.location = "index.html";
	throw new Error("El nombre y la sala son necesario");

}
/**
 * creamos el arreglo de parametros
 */ 
var usuario = {

	nombre: params.get('nombre'),
	sala: params.get('sala')

}
/**
 * Iniciamos en el chat y recibimos la lista de usuarios
 */
socket.on('connect', function () {

	socket.emit('entrarChar', usuario, function (resp) {
		// console.log("Usuarios conectados: ", resp)
		renderizarPersonas(resp);
	})

})

/**
 * Escuchamos cuando una persona se desconecta y llamamos la funcion de 
 * eliminarlo de la lista de personas conectadas
 * */ 
socket.on('disconnect', function () {
	socket.emit('eliminarUsuario')
})
/**
 * Escuchamos los enventos que suceden como inigreso o salio del chat
 */
socket.on('crearMensaje', function (mensaje) {
	// console.log(mensaje)
	renderizarMensajes(mensaje, false);
	scrollBottom();
})
/**
 * listamos las personas conectadas sin necesidad de registrarnos de nuevo
 */
socket.on('listarPersonas', function (personas) {
	renderizarPersonas(personas);
})

/**
 * Mensajes privados
 */
socket.on('mensajePrivado', function(mensaje){

	console.log("Mesaje privado: ",mensaje);
	
})
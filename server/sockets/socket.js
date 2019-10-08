const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utils/utilis')

const usuarios = new Usuarios();


io.on('connection', (client) => {
	
	client.on("entrarChar", (data, callback) => {

		if(!data.nombre) {

			return callback({
				error: true,
				mensaje: "El nombre es necesario"
			});
		}

		let personas = usuarios.agregarPersona(client.id, data.nombre);
		
		client.broadcast.emit("crearMensaje", crearMensaje(data.nombre, `El usuarios ${data.nombre} ingreso al chat`))
		
		client.broadcast.emit("listarPersonas", usuarios.getPersonas());

		return callback( personas );

	})

	client.on("disconnect", () => {

		let personaBorrada = usuarios.borrarPersona(client.id);

		client.broadcast.emit("crearMensaje", crearMensaje(personaBorrada.nombre, `El usuario ${personaBorrada.nombre} salio del chat`))

		client.broadcast.emit("listarPersonas", usuarios.getPersonas());

	})

	client.on("crearMensaje", (data) => {

		let persona = usuarios.getPersona(client.id);

		let mensaje = crearMensaje(persona.nombre, data.mensaje);

		client.broadcast.emit('crearMensaje', mensaje);

	})

	/**
	 * Mensajes privados
	 */

	 client.on('mensajePrivado', data => {

		let persona = usuarios.getPersona(client.id);

		let mensaje = crearMensaje(persona.nombre, data.mensaje);
		/**
		 * Se utiliza el to para enviar el id del socket del usuario que queremos enviar
		 * el mensaje
		 */
		client.broadcast.to(data.para).emit('mensajePrivado', mensaje);

	 })
	
})
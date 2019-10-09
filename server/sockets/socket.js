const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');

const { crearMensaje } = require('../utils/utilis')

const usuarios = new Usuarios();


io.on('connection', (client) => {

	client.on("entrarChar", (data, callback) => {

		if (!data.nombre || !data.sala) {

			return callback({

				error: true,
				mensaje: "El nombre y la sala son necesarios"

			});
		}

		client.join(data.sala);

		usuarios.agregarPersona(client.id, data.nombre, data.sala);

		// client.broadcast.to(data.sala).emit("crearMensaje", crearMensaje(data.nombre, `El usuario ${data.nombre} ingreso al chat`))

		client.broadcast.to(data.sala).emit("listarPersonas", usuarios.getPersonaPorSala(data.sala));

		return callback(usuarios.getPersonaPorSala(data.sala));

	})

	client.on("disconnect", () => {
		
		let personaBorrada = usuarios.borrarPersona(client.id);
		
		// client.broadcast.to(personaBorrada.sala).emit("crearMensaje", crearMensaje(personaBorrada.nombre, `El usuario ${personaBorrada.nombre} salio del chat` ))

		client.broadcast.to(personaBorrada.sala).emit("listarPersonas", usuarios.getPersonaPorSala(personaBorrada.sala));


	})

	client.on("crearMensaje", (data, callback) => {

		let persona = usuarios.getPersona(client.id);

		let mensaje = crearMensaje(persona.nombre, data.mensaje);

		client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

		callback(mensaje)
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
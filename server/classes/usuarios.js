// {
// 	id: "sdASd-apsdpokd43",
// 	nombre: "Alexander",
// 	sala: "Video Juegos"
// }

class Usuarios {

	constructor () {

		this.personas = [];

	}

	agregarPersona(id, nombre, sala) {
		
		let personaNueva = { id, nombre, sala };
		
		this.personas.push(personaNueva);

		return this.personas;
		
	}

	getPersona( id ) {

		let persona = this.personas.find( person => person.id === id);

		return persona
	}

	getPersonas() {

		return this.personas;

	}

	getPersonaPorSala( sala ){

		let personasEnSala = this.personas.filter(persona => persona.sala === sala);

		return personasEnSala;

	}

	borrarPersona( id ) {

		let personaBorrada = this.getPersona(id);

		this.personas = this.personas.filter( persona => persona.id != id );

		return personaBorrada;

	}

}

module.exports = {

	Usuarios

}
document.addEventListener("DOMContentLoaded", () => {
	if (localStorage.getItem("projeto") == null) {
	}
	createAndLoadDatabase();
	console.log(localStorage.getItem("projeto"));
});

class Usuario {
	constructor(nome, email) {
		this.nome = nome;
		this.email = email;
		this.nascimento = new Date();
	}
	idade() {
		// birthday is a date
		var ageDifMs = Date.now() - this.nascimento;
		var ageDate = new Date(ageDifMs); // miliseconds from 1970
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
}

class Usuarios {
	constructor() {
		this.usuarios = [];
	}
	novoUsuario(nome, email) {
		let usuario = new Usuario(nome, email);
		this.usuarios.push(usuario);
		return this.isCadastrado(usuario) ? undefined : usuario;
	}
	removerUsuario(nome) {
		this.usuarios = this.usuarios.filter((user) => user != nome);
	}
	todosUsuarios() {
		return this.usuarios.values();
	}
	numeroDeUsuarios() {
		return this.usuarios.length;
	}
	getUsuario(nome) {
		return this.usuarios.find((user) => user.nome == nome);
	}
	isCadastrado(nome) {
		return this.usuarios.find((user) => user.nome == nome) != undefined;
	}
	isCadastradoEmail(email) {
		return this.usuarios.find((user) => user.email == email) != undefined;
	}
}

class Produto {
	constructor(nome, tipo, detalhe) {
		this.nome = nome;
		this.tipo = tipo;
		this.detalhe = detalhe;
	}
}

let usuariosCadastrados = new Usuarios();

function cadastrarSolicitante() {
	let nome = document.getElementById("nome").value;
	let email = document.getElementById("email").value;
	let listaSolicitantes = document.getElementById("solicitantes");

	if (usuariosCadastrados.isCadastrado(nome)) {
		let li = document.createElement("li");
		li.textContent = "Usuario ja cadastrado.";
		listaSolicitantes.appendChild(li);
		return;
	}

	if (usuariosCadastrados.isCadastradoEmail(email)) {
		let li = document.createElement("li");
		li.textContent = "Email ja utilizado por outro usuário!";
		listaSolicitantes.appendChild(li);
		return;
	}

	usuariosCadastrados.novoUsuario(nome, email);

	const li = document.createElement("li");
	li.textContent = usuariosCadastrados.isCadastrado(nome)
		? "Usuario Cadastrado! Nome: " +
		  usuariosCadastrados.getUsuario(nome).nome
		: "Erro no cadastro.";

	listaSolicitantes.appendChild(li);
}

function createAndLoadDatabase() {
	alasql.options.dateAsString = true;
	alasql("CREATE localStorage DATABASE IF NOT EXISTS projeto");
	alasql("ATTACH localStorage DATABASE projeto");
	alasql("USE projeto");
	alasql(
		"CREATE TABLE IF NOT EXISTS products (id INT, category_id INT, name string, created_at DATE)"
	);
}
let data = Date.now().toString();
alasql(`INSERT INTO products VALUES (1, 1, 'car1', ${data})`);
console.log(alasql("SELECT * FROM products"));

function insertToDatabase() {}
function removeFromDatabase() {}

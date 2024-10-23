document.addEventListener("DOMContentLoaded", () => {
	if (localStorage.getItem("projetobloco") == null) {
	}
});

class Usuario {
	constructor(nome, senha, email) {
		this.nome = nome;
		this.senha = senha;
		this.email = email;
	}
}

class Usuarios {
	constructor() {
		this.usuarios = this.load();
	}
	load() {
		return alasql(`SELECT * FROM users`);
	}
	novoUsuario(nome, senha, email) {
		let usuario = new Usuario(nome, senha, email);
		if (this.isCadastrado(usuario)) {
			return undefined;
		}

		this.usuarios.push(usuario);
		alasql(
			`INSERT INTO users (name, password, email) VALUES ('${nome}', '${senha}', '${email}')`
		);
		console.log(alasql("SELECT * FROM users"));
		return this.isCadastrado(usuario) ? undefined : usuario;
	}
	removerUsuario(nome) {
		this.usuarios = this.usuarios.filter((user) => user != nome);
	}
	todosUsuarios() {
		return this.usuarios;
	}
	numeroDeUsuarios() {
		return this.usuarios.length;
	}
	getUsuario(nome) {
		return this.usuarios.find((user) => user.nome == nome);
	}
	checkPassword(nome, senha) {
		return this.getUsuario(nome).senha == senha;
	}
	isCadastrado(objUsuario) {
		return this.usuarios.includes(objUsuario);
		// return (
		// 	this.usuarios.find((user) => user.nome == objUsuario.nome) !=
		// 	undefined
		// );
	}
	isCadastradoNome(nome) {
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

// localStorage.clear();

alasql("CREATE localStorage DATABASE IF NOT EXISTS projeto_db");
alasql("ATTACH localStorage DATABASE projeto_db");
alasql("USE projeto_db");
alasql("DROP TABLE IF EXISTS users");

alasql(
	"CREATE TABLE IF NOT EXISTS users (name string, password VARCHAR(255), email string)"
);
alasql(
	`INSERT INTO users (name, password, email) VALUES ('Arthur', 'Croce', '@')`
);
alasql(
	`INSERT INTO users (name, password, email) VALUES ('Maria', 'Santos', '@')`
);
alasql(
	`INSERT INTO users (name, password, email) VALUES ('Pedro', 'Silva', '@')`
);
alasql(
	`INSERT INTO users (name, password, email) VALUES ('João', 'Almeida', '@')`
);
alasql(
	`INSERT INTO users (name, password, email) VALUES ('Luiza', 'Ribeiro', '@')`
);
// console.log(localStorage.getItem("projeto_db.disciplinas"));

let usuariosCadastrados = new Usuarios();
console.log(usuariosCadastrados.todosUsuarios());

function registerUser() {
	let nome = document.getElementById("input-username").value;
	let senha = document.getElementById("input-password").value;
	let email = "@";

	let returnDiv = document.getElementById("login-message");

	if (usuariosCadastrados.isCadastradoNome(nome)) {
		returnDiv.textContent = "Usuario ja cadastrado.";
		return;
	}

	// if (usuariosCadastrados.isCadastradoEmail(email)) {
	// 	returnDiv.textContent = "Email ja utilizado por outro usuário!";
	// 	return;
	// }

	usuariosCadastrados.novoUsuario(nome, senha, email);
}

function login() {
	let nome = document.getElementById("input-username").value;
	let senha = document.getElementById("input-password").value;

	let returnDiv = document.getElementById("login-message");

	if (!usuariosCadastrados.isCadastradoNome(nome)) {
		returnDiv.textContent =
			"Usuário não encontrado. Favor realizar o cadastro primeiro.";
		return;
	}

	if (!usuariosCadastrados.checkPassword(nome, senha)) {
		returnDiv.textContent = "Senha incorreta favor tentar novamente.";
		return;
	}

	sessionStorage.setItem("loginSession", nome);
	returnDiv.textContent = "Login realizado com Sucesso.";
}

function loggedActionEnabled() {
	return sessionStorage.getItem("loginSession") != null;
}

function insertToDatabase() {}
function removeFromDatabase() {}

canLoadProtectedPage();
window.addEventListener("load", () =>
{
	showLoggedNavBar();
});

// https://dexie.org/docs/Version/Version.stores()

// localStorage.clear();

alasql("CREATE localStorage DATABASE IF NOT EXISTS projeto_db");
alasql("ATTACH localStorage DATABASE projeto_db");
alasql("USE projeto_db");
alasql("DROP TABLE IF EXISTS users");

alasql("CREATE TABLE IF NOT EXISTS users (name string, password VARCHAR(255), email string, is_admin BOOLEAN, is_teacher BOOLEAN)");
alasql(`INSERT INTO users
        VALUES ('Arthur', 'Croce', '@', true, true)`);
alasql(`INSERT INTO users
        VALUES ('Maria', 'Santos', '@', false, true)`);
alasql(`INSERT INTO users
        VALUES ('Pedro', 'Silva', '@', false, false)`);
alasql(`INSERT INTO users
        VALUES ('João', 'Almeida', '@', false, false)`);
alasql(`INSERT INTO users
        VALUES ('Luiza', 'Ribeiro', '@', false, false)`);

// console.log(localStorage.getItem("projeto_db.disciplinas"));


class User
{
	constructor(name, password, email, is_admin, is_teacher)
	{
		this.name = name;
		this.password = password;
		this.email = email;
		this.is_admin = is_admin;
		this.is_teacher = is_teacher;
	}
}

class Student extends User
{
	constructor(name, password, email)
	{
		super(name, password, email, false, true);
	}
}

class Teacher extends User
{
	constructor(name, password, email)
	{
		super(name, password, email, false, true);
	}
}

class UserPool
{
	constructor()
	{
		this.usuarios = this.load();
	}

	load()
	{
		return alasql(`SELECT *
                       FROM users`);
	}

	novoUsuario(nome, senha, email)
	{
		let usuario = new User(nome, senha, email);
		if (this.isCadastrado(usuario))
		{
			return undefined;
		}

		this.usuarios.push(usuario);
		alasql(`INSERT INTO users
                VALUES ('${nome}', '${senha}', '${email}', 'false', 'false')`);
		return this.isCadastrado(usuario) ? undefined : usuario;
	}

	removerUsuario(nome)
	{
		this.usuarios = this.usuarios.filter((user) => user != nome);
	}

	todosUsuarios()
	{
		return this.usuarios;
	}

	numeroDeUsuarios()
	{
		return this.usuarios.length;
	}

	getUsuario(nome)
	{
		return this.usuarios.find((user) => user.name == nome);
	}

	checkPassword(nome, senha)
	{
		return this.getUsuario(nome).password == senha;
	}

	isCadastrado(objUsuario)
	{
		return this.usuarios.includes(objUsuario);
		// return (
		// 	this.usuarios.find((user) => user.name == objUsuario.name) !=
		// 	undefined
		// );
	}

	isCadastradoNome(nome)
	{
		return this.usuarios.find((user) => user.name == nome) != undefined;
	}

	isCadastradoEmail(email)
	{
		return this.usuarios.find((user) => user.email == email) != undefined;
	}
}

class Disciplinas
{
	constructor(nome, tipo, detalhe)
	{
		this.name = nome;
		this.tipo = tipo;
		this.detalhe = detalhe;
	}
}

class Curso
{
	constructor(nome, tipo, detalhe)
	{
		this.name = nome;
		this.tipo = tipo;
		this.detalhe = detalhe;
	}
}

class Turma
{
	constructor(nome, tipo, detalhe)
	{
		this.name = nome;
		this.tipo = tipo;
		this.detalhe = detalhe;
	}
}

// const db = new Dexie('FriendDatabase');
// db.version(1).stores({
// 	users: '++id, age'
// });
//
// let UserDB = db.users.defineClass(User)

let usuariosCadastrados = new UserPool();
console.log(usuariosCadastrados.todosUsuarios());

function registerUser()
{
	let nome = document.getElementById("input-username").value;
	let senha = document.getElementById("input-password").value;
	let email = "@";

	let returnDiv = document.getElementById("login-message");

	if (usuariosCadastrados.isCadastradoNome(nome))
	{
		returnDiv.textContent = "Usuario ja cadastrado.";
		return;
	}

	// if (usuariosCadastrados.isCadastradoEmail(email)) {
	// 	returnDiv.textContent = "Email ja utilizado por outro usuário!";
	// 	return;
	// }

	usuariosCadastrados.novoUsuario(nome, senha, email);
}

function isLoggedIn()
{
	return sessionStorage.getItem("loginSession") != null;
}

function login()
{
	let nome = document.getElementById("input-username").value;
	let senha = document.getElementById("input-password").value;

	let returnDiv = document.querySelector(".login-message");

	console.log(nome);
	console.log(senha);

	if (!usuariosCadastrados.isCadastradoNome(nome))
	{
		returnDiv.textContent = "Usuário não encontrado. Favor realizar o cadastro primeiro.";
		return;
	}

	if (!usuariosCadastrados.checkPassword(nome, senha))
	{
		returnDiv.textContent = "Senha incorreta favor tentar novamente.";
		console.log(usuariosCadastrados.todosUsuarios());
		return;
	}

	sessionStorage.setItem("loginSession", nome);
	console.log(sessionStorage.getItem("loginSession"));
	returnDiv.textContent = "Login realizado com Sucesso.";
	window.location = "./loggedOverview.html";
}

function logout()
{
	if (isLoggedIn())
	{
		sessionStorage.removeItem("loginSession");
	}
	else
	{
		alert("You are not logged into any account!");
	}

	window.location = "./index.html";
}

function canLoadProtectedPage()
{
	if (!isLoggedIn() && location.href.split("/").slice(-1) != "index.html")
	{
		alert("You need to be logged in to access this page!");
		window.location = "./index.html";
		return;
	}

	if (isLoggedIn() && location.href.split("/").slice(-1) == "index.html")
	{
		window.location = "./loggedOverview.html";
		return;
	}
}

function createNavLink(name, href, parentUl)
{
	let navBarLi = document.createElement("li");
	let navBarA = document.createElement("a");

	navBarA.setAttribute("href", href);
	navBarA.setAttribute("title", name);
	navBarA.innerHTML = name;

	navBarLi.appendChild(navBarA);
	parentUl.appendChild(navBarLi);
}

function showLoggedNavBar()
{
	let navBarLinks = [
		["Home", "./index.html"],
		["Disciplinas", "./disciplinas.html"],
		["Cadastro", "./cadastro.html"],
		["Alunos", "./alunos.html"],
	];

	if (!isLoggedIn())
	{
		let navBarUl = document.querySelector(".nav-ul");
		navBarUl.replaceChildren();
		createNavLink(navBarLinks[0][0], navBarLinks[0][1], navBarUl);
	}
	else
	{
		let navBarUl = document.querySelector(".nav-ul");
		navBarUl.replaceChildren();
		navBarLinks.forEach((link) =>
		{
			createNavLink(link[0], link[1], navBarUl);
		});
	}
}

// localStorage.clear();

canLoadProtectedPage();
window.addEventListener("load", () =>
{
	showLoggedNavBar();
});
window.addEventListener("beforeunload", () =>
{
	saveToLocalStorage();
})

class User
{
	#name;
	#password;
	#email;

	constructor(name, password, email)
	{
		this.#name = name;
		this.#password = password;
		this.#email = email;
	}

	get name()
	{
		return this.#name;
	}

	set name(value)
	{
		this.#name = value;
	}
	get password()
	{
		return this.#password;
	}

	set password(value)
	{
		this.#password = value;
	}
	get email()
	{
		return this.#email;
	}

	set email(value)
	{
		this.#email = value;
	}

}

class UserPool
{
	#users;
	constructor()
	{
		this.#users = localStorage.getItem("users");
	}

	novoUsuario(nome, senha, email)
	{
		let usuario = new User(nome, senha, email);
		if (this.isCadastrado(usuario))
		{
			return undefined;
		}

		this.usuarios.push(usuario);
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

function saveToLocalStorage(name,content)
{
	localStorage.setItem(name,JSON.stringify(content));
}

function loadFromLocalStorage(name)
{
	return JSON.parse(localStorage.getItem(name))
}
//canLoadProtectedPage();
window.addEventListener("load", () =>
{
	//showLoggedNavBar();
	const disciplinas = [
		{
			nome: "Matemática Básica", codigo: "MAT101", cargahoraria: 60, professor: "João Silva", curso: "Engenharia"
		}, {
			nome: "Programação em JavaScript",
			codigo: "CS102",
			cargahoraria: 80,
			professor: "Maria Oliveira",
			curso: "Ciência da Computação"
		}, {
			nome: "Introdução à Física", codigo: "FIS201", cargahoraria: 40, professor: "Carlos Mendes", curso: "Física"
		}, {
			nome: "Química Geral", codigo: "QUI301", cargahoraria: 50, professor: "Ana Pereira", curso: "Química"
		}, {
			nome: "Algoritmos e Estruturas de Dados",
			codigo: "CS202",
			cargahoraria: 70,
			professor: "Paulo Castro",
			curso: "Engenharia de Software"
		}, {
			nome: "História da Arte",
			codigo: "ART101",
			cargahoraria: 45,
			professor: "Juliana Martins",
			curso: "Arquitetura"
		}, {
			nome: "Gestão de Projetos",
			codigo: "ADM401",
			cargahoraria: 60,
			professor: "Rodrigo Almeida",
			curso: "Administração"
		}, {
			nome: "Economia Básica", codigo: "ECO101", cargahoraria: 40, professor: "Fernanda Costa", curso: "Economia"
		}, {
			nome: "Sistemas Operacionais",
			codigo: "CS301",
			cargahoraria: 75,
			professor: "Ricardo Lopes",
			curso: "Engenharia de Computação"
		}, {
			nome: "Marketing Digital",
			codigo: "MKT201",
			cargahoraria: 50,
			professor: "Mariana Ribeiro",
			curso: "Publicidade e Propaganda"
		}, {
			nome: "Cálculo Diferencial e Integral I",
			codigo: "MAT201",
			cargahoraria: 90,
			professor: "Luís Gonzaga",
			curso: "Engenharia"
		}, {
			nome: "Estruturas de Dados Avançadas",
			codigo: "CS302",
			cargahoraria: 70,
			professor: "Cláudia Torres",
			curso: "Ciência da Computação"
		}, {
			nome: "Mecânica Clássica", codigo: "FIS301", cargahoraria: 50, professor: "Sérgio Nunes", curso: "Física"
		}, {
			nome: "Bioquímica", codigo: "BIO101", cargahoraria: 60, professor: "Patrícia Almeida", curso: "Biologia"
		}, {
			nome: "Geometria Analítica",
			codigo: "MAT202",
			cargahoraria: 45,
			professor: "André Barros",
			curso: "Matemática"
		}, {
			nome: "Banco de Dados Relacionais",
			codigo: "CS402",
			cargahoraria: 80,
			professor: "Renato Silva",
			curso: "Sistemas de Informação"
		}, {
			nome: "Eletromagnetismo",
			codigo: "FIS401",
			cargahoraria: 70,
			professor: "Elis Regina",
			curso: "Engenharia Elétrica"
		}, {
			nome: "Química Orgânica", codigo: "QUI201", cargahoraria: 50, professor: "Leonardo Lima", curso: "Química"
		}, {
			nome: "Redes de Computadores",
			codigo: "CS502",
			cargahoraria: 60,
			professor: "Gabriela Souza",
			curso: "Engenharia de Computação"
		}, {
			nome: "Introdução à Filosofia",
			codigo: "FIL101",
			cargahoraria: 40,
			professor: "Antônio Carlos",
			curso: "Filosofia"
		}, {
			nome: "Gestão Financeira",
			codigo: "ADM201",
			cargahoraria: 55,
			professor: "Fernanda Melo",
			curso: "Administração"
		}, {
			nome: "Teoria da Computação",
			codigo: "CS601",
			cargahoraria: 75,
			professor: "Rafael Dantas",
			curso: "Ciência da Computação"
		}, {
			nome: "Psicologia Organizacional",
			codigo: "PSI301",
			cargahoraria: 50,
			professor: "Débora Costa",
			curso: "Psicologia"
		}, {
			nome: "Lógica Matemática",
			codigo: "MAT301",
			cargahoraria: 60,
			professor: "Marcelo Andrade",
			curso: "Engenharia de Software"
		}, {
			nome: "Direito Empresarial",
			codigo: "DIR101",
			cargahoraria: 40,
			professor: "Paula Ribeiro",
			curso: "Direito"
		}, {
			nome: "Segurança da Informação",
			codigo: "CS701",
			cargahoraria: 65,
			professor: "Marcos Tavares",
			curso: "Sistemas de Informação"
		}, {
			nome: "Microbiologia", codigo: "BIO201", cargahoraria: 70, professor: "Cristina Dias", curso: "Biologia"
		}, {
			nome: "Sociologia Aplicada",
			codigo: "SOC101",
			cargahoraria: 50,
			professor: "Roberto Fernandes",
			curso: "Sociologia"
		}, {
			nome: "Engenharia de Software",
			codigo: "CS801",
			cargahoraria: 80,
			professor: "Luana Machado",
			curso: "Engenharia de Computação"
		}, {
			nome: "Empreendedorismo",
			codigo: "ADM301",
			cargahoraria: 60,
			professor: "Gustavo Oliveira",
			curso: "Administração"
		}

	];
	TableCreator.create(disciplinas);
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
		this.#users = loadFromLocalStorage("users");
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

class TableCreator
{
	static currentPage = 1;
	static filteredData;

	static create(data)
	{
		this.itemsPerPage = Number(document.getElementById("itemsPerPage").value);
		this.tableBody = document.getElementById("tableBody");
		this.pagination = document.getElementById("pagination");
		this.itemsPerPageSelector = document.getElementById("itemsPerPage");
		this.searchBox = document.getElementById("searchBox");
		this.filteredData = data;
		this.data = data;

		this.itemsPerPageSelector.addEventListener("change", this.handleItemsPerPageChange.bind(this));
		this.pagination.addEventListener("click", this.handlePaginationClick.bind(this));
		this.searchBox.addEventListener("input", this.handleSearch.bind(this));

		this.updateTable();
	}

	static renderTable(page = 1)
	{
		const start = (page - 1) * this.itemsPerPage;
		const end = start + this.itemsPerPage;
		this.tableBody.innerHTML = this.filteredData
			.slice(start, end)
			.map(item =>
			{
				let stringReturn = "<tr>";
				for (const attribute in item)
				{
					stringReturn += `<td>${item[attribute]}</td>`;
				}

				stringReturn += "</tr>";
				return stringReturn;
			}).join("");
	}

	static renderPagination()
	{
		const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
		this.pagination.innerHTML = Array.from({length: totalPages}, (_, i) => `
                      <li class="page-item ${i + 1 === this.currentPage ? "active" : ""}">
                        <button class="page-link" data-page="${i + 1}">${i + 1}</button>
                      </li>
                `).join("");
	}

	static updateTable()
	{
		this.renderTable(this.currentPage);
		this.renderPagination();
	}

	static handleItemsPerPageChange()
	{
		this.itemsPerPage = parseInt(this.itemsPerPageSelector.value);
		this.currentPage = 1;
		this.updateTable();
	}

	static handlePaginationClick(event)
	{
		if (event.target.tagName === "BUTTON")
		{
			this.currentPage = parseInt(event.target.dataset.page);
			this.updateTable();
		}
	}

	static handleSearch()
	{
		const query = this.searchBox.value.toLowerCase();
		this.filteredData = this.data.filter(item =>
			Object.values(item).some(value =>
				typeof value === "string" && value.toLowerCase().includes(query)
			)
		);
		this.currentPage = 1;
		this.updateTable();
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
	if (!isLoggedIn() && location.href.split("/").slice(-1).join("") != "index.html")
	{
		alert("You need to be logged in to access this page!");
		window.location = "./index.html";
		return;
	}

	if (isLoggedIn() && location.href.split("/").slice(-1).join("") == "index.html")
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

function saveToLocalStorage(name, content)
{
	localStorage.setItem(name, JSON.stringify(content));
}

function loadFromLocalStorage(name)
{
	return JSON.parse(localStorage.getItem(name))
}

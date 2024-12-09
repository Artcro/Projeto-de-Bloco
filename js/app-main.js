//canLoadProtectedPage();
window.addEventListener("load", () =>
{
	//showLoggedNavBar();
	headerUserDisplay();
	const page = location.href.split("/").slice(-1)[0].split(".")[0];
	switch (page)
	{
		case "index":
			break;
		case "disciplinas":
			pageDisciplinas();
			break;
		case "cursos":
			break;
		case "alunos":
			pageAlunos();
			break;
		case "dashboard":
			break;
		case "professores":
			break;
		default:
			window.location = "./index.html";
			break;
	}
});
window.addEventListener("beforeunload", () =>
{

})
window.addEventListener("storage", (e) =>
{

	MemoryStorage.load(e);

	// console.log(e.key);
	// console.log(e.newValue);
	// console.log(e.oldValue);
	// console.log(e.storageArea);
	// console.log(e.url);
})

class MemoryStorage
{
	static #usuarios = [];
	static #disciplinas = [];
	static #cursos = [];

	static load(e)
	{
		switch (e.key)
		{
			case "users":
				this.loadUsers();
				break;
			case "disciplinas":
				this.loadDisciplinas();
				break;
			case "cursos":
				this.loadCursos();
				break;
			default:
				break;
		}
	}

	static loadUsers()
	{
		if (loadFromLocalStorage("users") && loadFromLocalStorage("users") > 0)
		{
			loadFromLocalStorage("users").forEach(user =>
			{
				console.log(user["access"]);
				switch (user["access"])
				{
					case "student":
						this.#usuarios = new Student(user);
						break;
					case "teacher":
						this.#usuarios = new Teacher(user);
						break;
					case "admin":
						//this.usuarios = new Admin(user);
						break;
					default:
						break;
				}
			});
		}
	}

	static loadDisciplinas()
	{
		if (loadFromLocalStorage("disciplinas") && loadFromLocalStorage("disciplinas") > 0)
		{
			loadFromLocalStorage("disciplinas").forEach(disciplina =>
			{
				this.#disciplinas = new Disciplinas(disciplina);
			});
		}
	}

	static loadCursos()
	{
		if (loadFromLocalStorage("cursos") && loadFromLocalStorage("cursos") > 0)
		{
			loadFromLocalStorage("cursos").forEach(curso =>
			{
				//this.#cursos = new Course(curso);
			});
		}
	}

	static get usuarios()
	{
		if (this.#usuarios.length < 1)
		{
			this.loadUsers();
		}
		return this.#usuarios;
	}

	static get disciplinas()
	{
		if (this.#disciplinas.length < 1)
		{
			this.loadDisciplinas();
		}
		return this.#disciplinas;
	}

	static get cursos()
	{
		if (this.#cursos.length < 1)
		{
			this.loadCursos();
		}
		return this.#cursos;
	}

	static set usuarios(value)
	{
		console.log("here");
		this.#usuarios.push(value);
		saveToLocalStorage("users", this.#usuarios);
	}

	static set disciplinas(value)
	{
		this.#disciplinas.push(value);
		saveToLocalStorage("disciplinas", this.#disciplinas);
	}

	static set cursos(value)
	{
		this.#cursos.push(value);
		saveToLocalStorage("cursos", this.#cursos)
	}
}

class User
{
	id;
	username;
	email;
	password;
	access;
	name;

	constructor(username, password, access, name)
	{
		this.username = username;
		this.password = password;
		this.access = access;
		this.name = name;
	}

	get id()
	{
		return this.id;
	}

	set id(value)
	{
		this.id = value;
	}

	get username()
	{
		return this.username;
	}

	set username(value)
	{
		this.username = value;
	}

	get password()
	{
		return this.password;
	}

	set password(value)
	{
		this.password = value;
	}

	get email()
	{
		return this.email;
	}

	set email(value)
	{
		this.email = value;
	}

	get access()
	{
		return this.access;
	}

	set access(value)
	{
		this.access = value;
	}
}

class Student extends User
{
	matricula;
	curso;
	periodo;
	disciplinas = [];

	constructor(username, name, matricula)
	{
		super(username, "", "student", name);
		this.matricula = matricula;
	}


	get matricula()
	{
		return this.matricula;
	}

	set matricula(value)
	{
		this.matricula = value;
	}

	get curso()
	{
		return this.curso;
	}

	set curso(value)
	{
		this.curso = value;
	}

	get periodo()
	{
		return this.periodo;
	}

	set periodo(value)
	{
		this.periodo = value;
	}

	get disciplinas()
	{
		return this.disciplinas;
	}

	set adicionarDisciplinas(value)
	{
		this.disciplinas.push(value);
	}
}

class Teacher extends User
{
	departamento
	disciplinas = [];

	constructor(username, password, name)
	{
		super(username, password, "teacher", name);
	}


	get departamento()
	{
		return this.departamento;
	}

	set departamento(value)
	{
		this.departamento = value;
	}

	get disciplinas()
	{
		return this.disciplinas;
	}

	set adicionarDisciplinas(value)
	{
		this.disciplinas.push(value);
	}


}

class Disciplinas
{
	id;
	name;
	workload;
	teacherId;
	courseId;

	constructor(name, codigo, workload, teacher, course)
	{
		this.name = name;
		this.id = codigo;
		this.workload = workload;
		this.teacherId = teacher;
		this.courseId = course;
	}

	get id()
	{
		return this.id;
	}

	set id(value)
	{
		this.id = value;
	}

	get name()
	{
		return this.name;
	}

	set name(value)
	{
		this.name = value;
	}

	get workload()
	{
		return this.workload;
	}

	set workload(value)
	{
		this.workload = value;
	}

	get teacherId()
	{
		return this.teacherId;
	}

	set teacherId(value)
	{
		this.teacherId = value;
	}

	get courseId()
	{
		return this.courseId;
	}

	set courseId(value)
	{
		this.courseId = value;
	}

}

class TableCreator
{
	static currentPage = 1;
	static itemsPerPage = 10;
	static data = [];
	static columns = [];
	static filteredData = [];
	static tableBody = null;
	static pagination = null;
	static itemsPerPageSelector = null;
	static searchBox = null;

	static initialize(config) {
		// Set configuration
		this.data = config.data || [];
		this.columns = config.columns || [];
		this.itemsPerPage = config.itemsPerPage || 10;

		// Set DOM elements
		this.tableBody = document.getElementById("tableBody");
		this.pagination = document.getElementById("pagination");
		this.itemsPerPageSelector = document.getElementById("itemsPerPage");
		this.searchBox = document.getElementById("searchBox");

		this.filteredData = [...this.data];

		// Add event listeners
		if (this.itemsPerPageSelector) {
			this.itemsPerPageSelector.addEventListener("change", this.handleItemsPerPageChange.bind(this));
		}
		if (this.pagination) {
			this.pagination.addEventListener("click", this.handlePaginationClick.bind(this));
		}
		if (this.searchBox) {
			this.searchBox.addEventListener("input", this.handleSearch.bind(this));
		}

		this.updateTable();
	}

	static renderTable(page = 1) {
		const start = (page - 1) * this.itemsPerPage;
		const end = start + this.itemsPerPage;

		// Generate table rows dynamically based on columns
		this.tableBody.innerHTML = this.filteredData
			.slice(start, end)
			.map(item => {
				const row = this.columns.map(column => `<td>${item[column] || ''}</td>`).join("");
				return `<tr>${row}</tr>`;
			})
			.join("");
	}

	static renderPagination() {
		const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
		this.pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <li class="page-item ${i + 1 === this.currentPage ? "active" : ""}">
                <button class="page-link" data-page="${i + 1}">${i + 1}</button>
            </li>
        `).join("");
	}

	static updateTable() {
		this.renderTable(this.currentPage);
		this.renderPagination();
	}

	static handleItemsPerPageChange() {
		this.itemsPerPage = parseInt(this.itemsPerPageSelector.value);
		this.currentPage = 1;
		this.updateTable();
	}

	static handlePaginationClick(event) {
		if (event.target.tagName === "BUTTON") {
			this.currentPage = parseInt(event.target.dataset.page);
			this.updateTable();
		}
	}

	static handleSearch() {
		const query = this.searchBox.value.toLowerCase();
		this.filteredData = this.data.filter(item =>
			this.columns.some(column => {
				const value = item[column];
				return typeof value === "string" && value.toLowerCase().includes(query);
			})
		);
		this.currentPage = 1;
		this.updateTable();
	}
}

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
	} else
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
	let navBarLinks = [["Home", "./index.html"], ["Disciplinas", "./disciplinas.html"], ["Cadastro", "./cadastro.html"], ["Alunos", "./alunos.html"],];

	if (!isLoggedIn())
	{
		let navBarUl = document.querySelector(".nav-ul");
		navBarUl.replaceChildren();
		createNavLink(navBarLinks[0][0], navBarLinks[0][1], navBarUl);
	} else
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

function headerUserDisplay()
{

}

function pageDisciplinas()
{
	if (document.getElementById("tableDisplay"))
	{
		TableCreator.initialize(MemoryStorage.disciplinas);

		document.getElementById("cadastrar-disciplina").addEventListener("click", () =>
		{
			const form = document.getElementById("form-disciplinas");
			let inputs = [...form.getElementsByTagName("input"),...form.getElementsByTagName("select")];
			inputs = inputs.map(input => input.value);
			MemoryStorage.disciplinas = new Disciplinas();
		})
	}
}

function pageAlunos()
{
	if (document.getElementById("tableDisplay"))
	{
		const tableConfig = {
			data: MemoryStorage.usuarios,
			columns: ["id", "name"], // Specify which columns to display
			itemsPerPage: 5
		};

		TableCreator.initialize(tableConfig);
	}

	document.getElementById("cadastrar-aluno").addEventListener("click", () =>{
		const username = checkInput("user-aluno");
		const name = checkInput("nome-aluno");
		const matricula = checkInput("matricula-aluno");

		const email = checkInput("email-aluno");
		const curso = checkInput("curso-aluno");

		const aluno = new Student(username,name,matricula);

		MemoryStorage.usuarios = aluno;

		aluno.email = email;
		aluno.curso = curso;

		console.log(MemoryStorage.usuarios);


	})
}

function pageProfessores()
{

}

function pageCursos()
{

}

function pageDashboard()
{

}

async function hashPasswordWithSalt(password, salt) {
	const encoder = new TextEncoder();
	const saltedPassword = password + salt; // Combine password and salt
	const data = encoder.encode(saltedPassword);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Generate a random salt
function generateSalt(length = 16) {
	const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let salt = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		salt += charset[randomIndex];
	}
	return salt;
}

function checkInput(inputName,text)
{
	let input = document.getElementById(inputName);
	let value = input.value;

	if(!value)
	{
		alert("Por favor preencha o campo!");
		return;
	}

	return value;
}
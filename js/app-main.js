canLoadProtectedPage();
window.addEventListener("load", () =>
{
	createBasicDatabase();
	showLoggedNavBar();
	headerUserDisplay();
	const page = location.href.split("/").slice(-1)[0].split(".")[0];

	const pageActions = {
		index: pageIndex,
		disciplinas: pageDisciplinas,
		alunos: pageAlunos,
		admin: pageAdmin,
		dashboard: pageDashboard,
	};

	(pageActions[page] || (() =>
	{
		window.location = "./index.html";
	}))();
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

let tableSectionElement = [];
let dbUsers = "users";
let dbDisciplinas = "disciplinas";
let dbCursos = "cursos";

class MemoryStorage
{
	static #usuarios = [];
	static #disciplinas = [];
	static #cursos = [];

	static get usuarios()
	{
		if (this.#usuarios.length < 1)
		{
			this.loadUsers();
		}
		return this.#usuarios;
	}

	static set usuarios(value)
	{
		this.loadUsers();
		this.#usuarios.push(value);
		saveToLocalStorage(dbUsers, this.#usuarios);
	}

	static get disciplinas()
	{
		if (this.#disciplinas.length < 1)
		{
			this.loadDisciplinas();
		}
		return this.#disciplinas;
	}

	static set disciplinas(value)
	{
		this.loadDisciplinas();
		this.#disciplinas.push(value);
		saveToLocalStorage(dbDisciplinas, this.#disciplinas);
	}

	static get cursos()
	{
		if (this.#cursos.length < 1)
		{
			this.loadCursos();
		}
		return this.#cursos;
	}

	static set cursos(value)
	{
		this.loadCursos();
		this.#cursos.push(value);
		saveToLocalStorage(dbCursos, this.#cursos)
	}

	static removeUser(id)
	{
		if (this.#usuarios.length < 1)
		{
			this.loadUsers();
		}
		this.#usuarios.splice(id, 1);
		saveToLocalStorage(dbUsers, this.#usuarios);
	}

	static removeDisciplina(id)
	{
		if (this.#disciplinas.length < 1)
		{
			this.loadDisciplinas();
		}
		this.#disciplinas.splice(id, 1);
		saveToLocalStorage(dbUsers, this.#disciplinas);
	}

	static removeCurso(id)
	{
		if (this.#cursos.length < 1)
		{
			this.loadCursos();
		}
		this.#cursos.splice(id, 1);
		saveToLocalStorage(dbUsers, this.#cursos);
	}

	static addUser(value)
	{
		this.loadUsers();
		this.#usuarios.push(value);
		saveToLocalStorage(dbUsers, this.#usuarios);
	}

	static load(e)
	{
		switch (e.key)
		{
			case dbUsers:
				this.loadUsers();
				break;
			case dbDisciplinas:
				this.loadDisciplinas();
				break;
			case dbCursos:
				this.loadCursos();
				break;
			default:
				break;
		}
	}

	static loadUsers()
	{
		const loaded = loadFromLocalStorage(dbUsers);
		if (loaded)
		{
			this.#usuarios = [];

			const userTypes = {
				student: Student, teacher: Teacher, admin: User,
			};

			loaded.forEach(user =>
			{
				const UserClass = userTypes[user.access];
				if (UserClass)
				{
					this.#usuarios.push(new UserClass(user));
				}
			});
		}
	}

	static loadDisciplinas()
	{
		const loaded = loadFromLocalStorage(dbDisciplinas);
		if (loaded)
		{
			this.#disciplinas = [];

			loaded.forEach(disciplina =>
			{
				this.#disciplinas.push(new Disciplina(disciplina))
			})
		}
	}

	static loadCursos()
	{
		const loaded = loadFromLocalStorage(dbCursos);
		if (loaded)
		{
			this.#cursos = [];

			loaded.forEach(curso =>
			{
				this.#cursos.push(new Curso(curso))
			})
		}
	}

	static getId()
	{
		const loaded = loadFromLocalStorage(dbUsers);
		if (loaded)
		{
			return Math.max(...loaded.map(user => user.id)) + 1;
		}
		return 0;
	}

	static getIdDisciplina()
	{
		const loaded = loadFromLocalStorage(dbDisciplinas);
		if (loaded)
		{
			return Math.max(...loaded.map(disciplina => disciplina.id)) + 1;
		}
		return 1000;
	}

	static getIdCurso()
	{
		const loaded = loadFromLocalStorage(dbCursos);
		if (loaded)
		{
			return Math.max(...loaded.map(curso => curso.id)) + 1;
		}
		return 100;
	}

	static getMatricula()
	{
		const loaded = loadFromLocalStorage(dbUsers);
		if (loaded)
		{
			const matriculas = loaded
				.filter(user => user.access == "student")
				.map(user => user.matricula);

			return Math.max(...matriculas) + 1;
		}
		return 10000;
	}

	static canHaveUsername(username)
	{
		const loaded = loadFromLocalStorage(dbUsers) || [];
		if (loaded)
		{
			const users = loaded
				.map(user => user.username)
				.includes(username);

			return !users;
		}
		return false;
	}

	static getSessionUser()
	{
		let session = sessionStorage.getItem("loginSession");
		if (session)
		{
			return this.usuarios.find(user => user.id == session);
		}
		return undefined;
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

	constructor({id, username, password, email, access, name})
	{
		this.id = id;
		this.username = username;
		this.password = password;
		this.email = email;
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

	constructor({id, username, password, email, name, matricula, curso, periodo, disciplinas})
	{
		super({id, username, password, email, access: "student", name});
		this.matricula = matricula;
		this.curso = curso;
		this.periodo = periodo;
		this.disciplinas = disciplinas;
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

	constructor({id, username, password, email, name, departamento, disciplinas})
	{
		super({id, username, password, email, access: "teacher", name});
		this.departamento = departamento;
		this.disciplinas = disciplinas;
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

class Disciplina
{
	id;
	name;
	workload;
	teacherId;
	courseId;

	constructor({id, name, workload, teacher, course})
	{
		this.id = id;
		this.name = name;
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

class Curso
{
	id
	name
	description
	disciplinas = [];
	alunos = []

	constructor({id, name, description, disciplinas, alunos})
	{
		this.id = id;
		this.name = name;
		this.description = description;
		this.disciplinas = disciplinas;
		this.alunos = alunos;
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

	get description()
	{
		return this.description;
	}

	set description(value)
	{
		this.description = value;
	}

	get disciplinas()
	{
		return this.disciplinas;
	}

	set disciplinas(value)
	{
		this.disciplinas = value;
	}
}

function isLoggedIn()
{
	return sessionStorage.getItem("loginSession") != null;
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
	const page = location.href.split("/").slice(-1)[0].split(".")[0];
	if (!isLoggedIn() && page != "index")
	{
		alert("You need to be logged in to access this page!");
		window.location = "./index.html";
		return;
	}

	if (isLoggedIn() && page == "index")
	{
		window.location = "./dashboard.html";
	}
}

function showLoggedNavBar()
{
	if (isLoggedIn())
	{
		const commonLinks = [
			{text: "Home", href: "./index.html"},
			//{text: "Contact", href: "/contact.html"},
		];

		const accessLinks = {
			student: [
				{text: "Painel", href: "./dashboard.html"},
				{text: "Usuarios", href: "./alunos.html"},
				{text: "Cursos", href: "./cursos.html"},
			],
			teacher: [
				{text: "Disciplinas", href: "./disciplinas.html"},
				//{text: "", href: "/assignments.html"},
			]
		};

		accessLinks.admin = [...accessLinks.student, ...accessLinks.teacher, {text: "Admin", href: "./admin.html"}]

		const specificLinks = accessLinks[MemoryStorage.getSessionUser().access] || [];
		const allLinks = [...commonLinks, ...specificLinks]; // Combine common and specific links

		const ul = document.getElementById("main-menu-nav");

		ul.innerHTML = allLinks
			.map(link => `
            <li>
                <a class="nav-link px-2 link-primary" href="${link.href}">
                    ${link.text}
                </a>
            </li>
        `).join("");
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
	if (isLoggedIn())
	{
		const name = document.getElementById("header-user-name");
		const type = document.getElementById("header-user-type");
		const img = document.getElementById("header-user-img");
		const dropdown = document.getElementById("header-user-dropdown");
		const a = document.getElementById("header-user-action");

		let user = MemoryStorage.getSessionUser();

		if (user)
		{
			name.textContent = capitalizeFirstLetter(user.name);
			type.textContent = capitalizeFirstLetter(user.access);
			//img.src = user.img;
			dropdown.innerHTML = `
            <li><a class="dropdown-item" href="#" onclick="logout()">Sign out</a></li>
            `
			a.setAttribute("data-bs-toggle", "dropdown");
		}
	}
}

async function hashPassword(password)
{
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function checkInput(inputName)
{
	let input = document.getElementById(inputName);
	let value = input.value;

	if (!value)
	{
		alert("Por favor preencha o campo!");
		return;
	}

	return value;
}

function capitalizeFirstLetter(val)
{
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function pageDisciplinas()
{
	let data = MemoryStorage.disciplinas;
	renderTable(data, "tableBody", "tableHead","disciplinas", "OnRemoveDisciplina");

	document.getElementById("cadastrar-disciplina").addEventListener("click", () =>
	{
		const id = MemoryStorage.getIdDisciplina();
		const name = checkInput("nome-disciplina");
		const workload = checkInput("cargaHoraria");
		const teacher = document.getElementById("professor-disciplina");
		const curso = document.getElementById("curso-disciplina");


		MemoryStorage.disciplinas = new Disciplina({id, name, workload, teacher: teacher.value, course: curso.value});

		let data = MemoryStorage.disciplinas;
		renderTable(data, "tableBody", "tableHead","disciplinas", "OnRemoveDisciplina");
	})
}

function pageAlunos()
{
	let data = MemoryStorage.usuarios;
	renderTable(data, "tableBody", "tableHead","users", "OnRemoveUser");
	
	document.getElementById("cadastrar-usuario").addEventListener("click", () =>
	{
		const id = MemoryStorage.getId();
		const username = checkInput("user");
		const password = checkInput("password");
		const access = checkInput("access");
		const name = checkInput("name");
		const matricula = MemoryStorage.getMatricula();

		if (!MemoryStorage.canHaveUsername(username))
		{
			alert("Nome de Usuário já foi cadastrado!")
			return;
		}

		let user;

		hashPassword(password).then(hash =>
		{
			switch (access)
			{
				case "admin":
					user = new User(
						{id, username, hash, email: undefined, access: "admin", name});
					break;
				case "teacher":
					user = new Teacher({
						id, username, hash, email: undefined, name, departamento: undefined, disciplinas: undefined
					});
					break;
				case "student":
					user = new Student({
						id,
						username,
						hash,
						email: undefined,
						name,
						matricula,
						curso: undefined,
						periodo: undefined,
						disciplinas: undefined
					});
					break;
				default:
					break;
			}

			MemoryStorage.usuarios = user;
		});

		let data = MemoryStorage.usuarios;
		renderTable(data, "tableBody", "tableHead","users", "OnRemoveUser");
	})
	

	
}

function pageProfessores()
{

}

function pageCursos()
{

}

function pageIndex()
{
	document.getElementById("login").addEventListener("click", () =>
	{

		sessionStorage.removeItem("loginSession");

		let nome = document.getElementById("username").value;
		let senha = document.getElementById("password").value;
		let returnDiv = document.getElementById("loginMessage");

		const user = MemoryStorage.usuarios.find(usuario => usuario.username == nome);

		returnDiv.setAttribute("class", "mt-3 mb-0");

		if (!user)
		{
			returnDiv.classList.add("alert");
			returnDiv.classList.add("alert-warning");
			returnDiv.textContent = "Usuário não encontrado. Favor realizar o cadastro primeiro.";
			return;
		}

		hashPassword(senha).then(hash =>
		{
			if (!user.password)
			{
				user.password = hash;
			} else if (user.password != hash)
			{
				returnDiv.classList.add("alert");
				returnDiv.classList.add("alert-danger");
				returnDiv.textContent = "Senha incorreta favor tentar novamente.";
				return;
			}

			sessionStorage.setItem("loginSession", user.id);
			console.log(sessionStorage.getItem("loginSession"));

			returnDiv.classList.add("alert");
			returnDiv.classList.add("alert-success");
			returnDiv.textContent = "Login realizado com Sucesso.";
			window.location = "./dashboard.html";
		});
	});
}

function pageAdmin()
{
	// Casastro de usuário
	document.getElementById("cadastrar-usuario").addEventListener("click", () =>
	{
		const id = MemoryStorage.getId();
		const username = checkInput("user");
		const password = checkInput("password");
		const access = checkInput("access");
		const name = checkInput("name");
		const matricula = MemoryStorage.getMatricula();

		if (!MemoryStorage.canHaveUsername(username))
		{
			alert("Nome de Usuário já foi cadastrado!")
			return;
		}

		let user;

		hashPassword(password).then(hash =>
		{
			switch (access)
			{
				case "admin":
					user = new User(
						{id, username, hash, email: undefined, access: "admin", name});
					break;
				case "teacher":
					user = new Teacher({
						id, username, hash, email: undefined, name, departamento: undefined, disciplinas: undefined
					});
					break;
				case "student":
					user = new Student({
						id,
						username,
						hash,
						email: undefined,
						name,
						matricula,
						curso: undefined,
						periodo: undefined,
						disciplinas: undefined
					});
					break;
				default:
					break;
			}

			MemoryStorage.usuarios = user;
		});
	})


	// Casastro de disciplina
	loadDisciplinaInputs();

	document.getElementById("cadastrar-disciplina").addEventListener("click", () =>
	{
		const id = MemoryStorage.getIdDisciplina();
		const name = checkInput("disciplina-name");
		const workload = checkInput("disciplina-workload");
		const teacher = document.getElementById("disciplina-teacher");
		const curso = document.getElementById("disciplina-curso");


		MemoryStorage.disciplinas = new Disciplina({id, name, workload, teacher: teacher.value, course: curso.value});
	})
}

function pageDashboard()
{

}

function loadDisciplinaInputs()
{
	const teacher = document.getElementById("disciplina-teacher");
	const curso = document.getElementById("disciplina-curso");

	MemoryStorage.usuarios.filter(user => user.access == "teacher").forEach(t =>
	{
		teacher.innerHTML += `
			<option value="${t.id}">${t.name}</option>
		`
	})

	MemoryStorage.cursos.forEach(c =>
	{
		curso.innerHTML += `
				<option value="${c.id}">${c.name}</option>
			`
	})
}

function deleteElement(tableButtonElement)
{

}

function createBasicDatabase()
{
	if (MemoryStorage.canHaveUsername("Arthur"))
	{
		hashPassword("Croce").then(hash =>
		{

			const user = new User({
				id: 0,
				username: "Arthur",
				password: hash,
				email: undefined,
				access: "admin",
				name: "Arthur"
			});

			MemoryStorage.addUser(user);
		})
	}
}

function renderTable(data, tableBodyId, tableHeadId, tableType, onRemove)
{
	if (!data) return;
	const tableBody = document.getElementById(tableBodyId);
	const tableHead = document.getElementById(tableHeadId);

	// Get the object with the most properties
	const largestObject = data.reduce((largest, current) =>
		Object.keys(current).length > Object.keys(largest).length ? current : largest, {});

	// Render the table headers dynamically
	function renderHeaders() {
		const headers = Object.keys(largestObject);
		tableHead.innerHTML = `
            <tr>
                ${headers.map(header => `<th>${header.charAt(0).toUpperCase() + header.slice(1)}</th>`).join("")}
                <th>Actions</th>
            </tr>
        `;
	}

	// Render the table rows dynamically
	function renderRows() {
		tableBody.innerHTML = data.map(item => {
			// Fill missing keys with empty strings
			const rowValues = Object.keys(largestObject).map(key => item[key] || "");
			return `
                <tr>
                    ${rowValues.map(value => `<td>${value}</td>`).join("")}
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="(${onRemove})('${item.id}', '${tableType}')">Remove</button>
                    </td>
                </tr>
            `;
		}).join("");
	}

	// Initial render
	renderHeaders();
	renderRows();
}

function OnRemoveUser(id, type)
{
	MemoryStorage.removeUser(id);
	let data = MemoryStorage.usuarios;
	renderTable(data, "tableBody", "tableHead","users", OnRemoveUser);
}

function OnRemoveDisciplina(id, type)
{
	MemoryStorage.removeUser(id);
	let data = MemoryStorage.usuarios;
	renderTable(data, "tableBody", "tableHead","users", OnRemoveUser);
}

function OnRemoveCurso(id, type)
{
	MemoryStorage.removeUser(id);
	let data = MemoryStorage.usuarios;
	renderTable(data, "tableBody", "tableHead","users", OnRemoveUser);
}



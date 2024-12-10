//canLoadProtectedPage();
window.addEventListener("load", () => {
    //showLoggedNavBar();
    headerUserDisplay();
    const page = location.href.split("/").slice(-1)[0].split(".")[0];

    const pageActions = {
        index: pageIndex,
        disciplinas: pageDisciplinas,
        alunos: pageAlunos,
        admin: pageAdmin,
        dashboard: pageDashboard,
    };

    (pageActions[page] || (() => {
        window.location = "./index.html";
    }))();
});
window.addEventListener("beforeunload", () => {

})
window.addEventListener("storage", (e) => {

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

class MemoryStorage {
    static #usuarios = [];
    static #disciplinas = [];
    static #cursos = [];
    
    static get usuarios() {
        if (this.#usuarios.length < 1) {
            this.loadUsers();
        }
        return this.#usuarios;
    }

    static set usuarios(value) {
        this.loadUsers();
        this.#usuarios.push(value);
        saveToLocalStorage(dbUsers, this.#usuarios);
    }

    static get disciplinas() {
        if (this.#disciplinas.length < 1) {
            this.loadDisciplinas();
        }
        return this.#disciplinas;
    }

    static set disciplinas(value) {
        this.loadDisciplinas();
        this.#disciplinas.push(value);
        saveToLocalStorage(dbDisciplinas, this.#disciplinas);
    }

    static get cursos() {
        if (this.#cursos.length < 1) {
            this.loadCursos();
        }
        return this.#cursos;
    }

    static set cursos(value) {
        this.loadCursos();
        this.#cursos.push(value);
        saveToLocalStorage(dbCursos, this.#cursos)
    }

    static load(e) {
        switch (e.key) {
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

    static loadUsers() {
        const loaded = loadFromLocalStorage(dbUsers);
        if (loaded) {
            this.#usuarios = [];

            const userTypes = {
                student: Student, teacher: Teacher, admin: User,
            };

            loaded.forEach(user => {
                const UserClass = userTypes[user.access];
                if (UserClass) {
                    this.#usuarios.push(new UserClass(user));
                }
            });
        }
    }

    static loadDisciplinas() {
        if (loadFromLocalStorage(dbDisciplinas) && loadFromLocalStorage(dbDisciplinas) > 0) {
            loadFromLocalStorage(dbDisciplinas).forEach(disciplina => {
                this.#disciplinas = new Disciplinas(disciplina);
            });
        }
    }

    static loadCursos() {
        if (loadFromLocalStorage(dbCursos) && loadFromLocalStorage(dbCursos) > 0) {
            loadFromLocalStorage(dbCursos).forEach(curso => {
                //this.#cursos = new Course(curso);
            });
        }
    }

    static getId() {
        const loaded = loadFromLocalStorage(dbUsers);
        if (loaded) {
            return Math.max(...loaded.map(user => user.id)) + 1;
        }
        return 0;
    }

    static getMatricula() {
        const loaded = loadFromLocalStorage(dbUsers);
        if (loaded) {
            const matriculas = loaded
                .filter(user => user.access == "student")
                .map(user => user.matricula);

            return Math.max(...matriculas) + 1;
        }
        return 10000;
    }

    static canHaveUsername(username) {
        const loaded = loadFromLocalStorage(dbUsers) || [];
        if (loaded) {
            const users = loaded
                .map(user => user.username)
                .includes(username);

            return !users;
        }
        return false;
    }
    
    static getSessionUser() {
        let session = sessionStorage.getItem("loginSession");
        if (session) {
            return this.usuarios.find(user => user.id == session);
        }
        return undefined;
    }
}

class User {
    id;
    username;
    email;
    password;
    access;
    name;

    constructor({id, username, password, email, access, name}) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.access = access;
        this.name = name;
    }

    get id() {
        return this.id;
    }

    set id(value) {
        this.id = value;
    }

    get username() {
        return this.username;
    }

    set username(value) {
        this.username = value;
    }

    get password() {
        return this.password;
    }

    set password(value) {
        this.password = value;
    }

    get email() {
        return this.email;
    }

    set email(value) {
        this.email = value;
    }

    get access() {
        return this.access;
    }

    set access(value) {
        this.access = value;
    }
}

class Student extends User {
    matricula;
    curso;
    periodo;
    disciplinas = [];

    constructor({id, username, password, email, name, matricula, curso, periodo, disciplinas}) {
        super({id, username, password, email, access: "student", name});
        this.matricula = matricula;
        this.curso = curso;
        this.periodo = periodo;
        this.disciplinas = disciplinas;
    }


    get matricula() {
        return this.matricula;
    }

    set matricula(value) {
        this.matricula = value;
    }

    get curso() {
        return this.curso;
    }

    set curso(value) {
        this.curso = value;
    }

    get periodo() {
        return this.periodo;
    }

    set periodo(value) {
        this.periodo = value;
    }

    get disciplinas() {
        return this.disciplinas;
    }

    set adicionarDisciplinas(value) {
        this.disciplinas.push(value);
    }
}

class Teacher extends User {
    departamento
    disciplinas = [];

    constructor({id, username, password, email, name, departamento, disciplinas}) {
        super({id, username, password, email, access: "teacher", name});
        this.departamento = departamento;
        this.disciplinas = disciplinas;
    }


    get departamento() {
        return this.departamento;
    }

    set departamento(value) {
        this.departamento = value;
    }

    get disciplinas() {
        return this.disciplinas;
    }

    set adicionarDisciplinas(value) {
        this.disciplinas.push(value);
    }


}

class Disciplinas {
    id;
    name;
    workload;
    teacherId;
    courseId;

    constructor(id, name, workload, teacher, course) {
        this.id = id;
        this.name = name;
        this.workload = workload;
        this.teacherId = teacher;
        this.courseId = course;
    }

    get id() {
        return this.id;
    }

    set id(value) {
        this.id = value;
    }

    get name() {
        return this.name;
    }

    set name(value) {
        this.name = value;
    }

    get workload() {
        return this.workload;
    }

    set workload(value) {
        this.workload = value;
    }

    get teacherId() {
        return this.teacherId;
    }

    set teacherId(value) {
        this.teacherId = value;
    }

    get courseId() {
        return this.courseId;
    }

    set courseId(value) {
        this.courseId = value;
    }

}

class TableCreator {
    constructor(config) {
        // Configurable properties
        this.data = config.data || [];
        this.columns = config.columns || []; // Define the columns to display
        this.itemsPerPage = config.itemsPerPage || 10;
        this.currentPage = 1;

        // DOM elements
        this.tableBody = document.getElementById(card - body);
        this.pagination = document.getElementById(config.paginationId);
        this.itemsPerPageSelector = document.getElementById(config.itemsPerPageSelectorId);
        this.searchBox = document.getElementById(config.searchBoxId);

        this.filteredData = [...this.data];

        // Event listeners
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

    renderTable(page = 1) {
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

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        this.pagination.innerHTML = Array.from({length: totalPages}, (_, i) => `
            <li class="page-item ${i + 1 === this.currentPage ? "active" : ""}">
                <button class="page-link" data-page="${i + 1}">${i + 1}</button>
            </li>
        `).join("");
    }

    updateTable() {
        this.renderTable(this.currentPage);
        this.renderPagination();
    }

    handleItemsPerPageChange() {
        this.itemsPerPage = parseInt(this.itemsPerPageSelector.value);
        this.currentPage = 1;
        this.updateTable();
    }

    handlePaginationClick(event) {
        if (event.target.tagName === "BUTTON") {
            this.currentPage = parseInt(event.target.dataset.page);
            this.updateTable();
        }
    }

    handleSearch() {
        const query = this.searchBox.value.toLowerCase();
        this.filteredData = this.data.filter(item => this.columns.some(column => {
            const value = item[column];
            return typeof value === "string" && value.toLowerCase().includes(query);
        }));
        this.currentPage = 1;
        this.updateTable();
    }
}

function isLoggedIn() {
    return sessionStorage.getItem("loginSession") != null;
}

function logout() {
    if (isLoggedIn()) {
        sessionStorage.removeItem("loginSession");
    } else {
        alert("You are not logged into any account!");
    }

    window.location = "./index.html";
}

function canLoadProtectedPage() {
    const page = location.href.split("/").slice(-1)[0].split(".")[0];
    if (!isLoggedIn() && page != "index") {
        alert("You need to be logged in to access this page!");
        window.location = "./index.html";
        return;
    }

    if (isLoggedIn() && page == "index") {
        window.location = "./loggedOverview.html";
    }
}

function createNavLink(name, href, parentUl) {
    let navBarLi = document.createElement("li");
    let navBarA = document.createElement("a");

    navBarA.setAttribute("href", href);
    navBarA.setAttribute("title", name);
    navBarA.innerHTML = name;

    navBarLi.appendChild(navBarA);
    parentUl.appendChild(navBarLi);
}

function showLoggedNavBar() {
    let navBarLinks = [["Home", "./index.html"], ["Disciplinas", "./disciplinas.html"], ["Cadastro", "./cadastro.html"], ["Alunos", "./alunos.html"],];

    if (!isLoggedIn()) {
        let navBarUl = document.querySelector(".nav-ul");
        navBarUl.replaceChildren();
        createNavLink(navBarLinks[0][0], navBarLinks[0][1], navBarUl);
    } else {
        let navBarUl = document.querySelector(".nav-ul");
        navBarUl.replaceChildren();
        navBarLinks.forEach((link) => {
            createNavLink(link[0], link[1], navBarUl);
        });
    }
}

function saveToLocalStorage(name, content) {
    localStorage.setItem(name, JSON.stringify(content));
}

function loadFromLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name))
}

function headerUserDisplay() {
    if (isLoggedIn()) {
        const name = document.getElementById("header-user-name");
        const type = document.getElementById("header-user-type");
        const img = document.getElementById("header-user-img");
        const dropdown = document.getElementById("header-user-dropdown");
        const a = document.getElementById("header-user-action");

        let user = MemoryStorage.getSessionUser();

        if (user){
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

function pageDisciplinas() {
    if (document.getElementById("tableDisplay")) {
        TableCreator.initialize(MemoryStorage.disciplinas);

        document.getElementById("cadastrar-disciplina").addEventListener("click", () => {
            const form = document.getElementById("form-disciplinas");
            let inputs = [...form.getElementsByTagName("input"), ...form.getElementsByTagName("select")];
            inputs = inputs.map(input => input.value);
            MemoryStorage.disciplinas = new Disciplinas();
        })
    }
}

function pageAlunos() {
    if (document.getElementById("tableDisplay")) {
        MemoryStorage.usuarios.forEach(usuario => {

        })
    }

    document.getElementById("cadastrar-aluno").addEventListener("click", () => {
        const username = checkInput("user-aluno");
        const name = checkInput("nome-aluno");
        const matricula = checkInput("matricula-aluno");

        const email = checkInput("email-aluno");
        const curso = checkInput("curso-aluno");

        const aluno = new Student(username, name, matricula);

        MemoryStorage.usuarios = aluno;

        aluno.email = email;
        aluno.curso = curso;

        console.log(MemoryStorage.usuarios);


    })
}

function pageProfessores() {

}

function pageCursos() {

}

function pageIndex() {
    document.getElementById("login").addEventListener("click", () => {

        sessionStorage.removeItem("loginSession");

        let nome = document.getElementById("username").value;
        let senha = document.getElementById("password").value;
        let returnDiv = document.getElementById("loginMessage");

        const user = MemoryStorage.usuarios.find(usuario => usuario.username == nome);

        returnDiv.setAttribute("class", "mt-3 mb-0");

        if (!user) {
            returnDiv.classList.add("alert");
            returnDiv.classList.add("alert-warning");
            returnDiv.textContent = "Usuário não encontrado. Favor realizar o cadastro primeiro.";
            return;
        }

        hashPassword(senha).then(hash => {
            if (!user.password) {
                user.password = hash;
            } else if (user.password != hash) {
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

function pageAdmin() {
    document.getElementById("cadastrar-usuario").addEventListener("click", () => {
        const id = MemoryStorage.getId();
        const username = checkInput("user");
        const password = checkInput("password");
        const access = checkInput("access");
        const name = checkInput("name");
        const matricula = MemoryStorage.getMatricula();

        if (!MemoryStorage.canHaveUsername(username)) {
            alert("Nome de Usuário já foi cadastrado!")
            return;
        }

        let user;

        hashPassword(password).then(hash => {
            switch (access) {
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
}

function pageDashboard() {

}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function checkInput(inputName) {
    let input = document.getElementById(inputName);
    let value = input.value;

    if (!value) {
        alert("Por favor preencha o campo!");
        return;
    }

    return value;
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
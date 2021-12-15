// Executa assim que o html for carregado
window.onload = () => {
    main();
};

// Acrescenta a base de dados ao localStorage caso nao esteja la
async function fetchData() {
    if (localStorage.getItem("db_gasto") === null) {
        const response = await fetch("./gastos.json");
        const data = await response.json();
        localStorage.setItem("db_gasto", JSON.stringify(data["data"]));
    }
}

// Função principal
async function main() {
    await fetchData();

    // Criando identificador para atualizar e deletar gasto
    let id;

    // Mostrar tabela de gastos
    showExpenses(getDatabase());
    showTotalExpenses();

    let chart = createChart(chartData());

    // Ações
    // Inserir novo gasto à tabela
    document.querySelector("form#form-gasto").addEventListener("submit", e => {
        submitExpense(e);
        hideModal();
        updateChart(chart);
        showTotalExpenses();
    });

    // Define o índice do gasto a ser editado, preenche o modal de edição e o mostra
    document.getElementById("table-gastos").addEventListener("click", e => {
        id = e.target.parentNode.id;
        fillModal(id);
        showModal(true);
    });


    // Deleta o gasto selecionado
    document.getElementById("btnDelete").addEventListener("click", () => {
        deleteExpense(id);
        hideModal();
        updateChart(chart);
        showTotalExpenses();
    });

    // Atualiza o gasto
    document.getElementById("btnUpdate").addEventListener("click", () => {
        updateExpense(id);
        hideModal();
        updateChart(chart);
        showTotalExpenses();
    });

    // Mostra o modal
    document.getElementById("addDespesaBtn").addEventListener("click", () => showModal());

    // Esconde o modal
    document.getElementById("btnCancel").addEventListener("click", hideModal);



    document.getElementById("alterarCarteira").addEventListener("click", showBalanceModal);
    document.getElementById("confirmarCarteira").addEventListener("click", confirmBalance);
    document.getElementById("cancelarCarteira").addEventListener("click", hideBalanceModal);
}

function confirmBalance() {
    if (document.getElementById("inputCarteira").value != "") {
        document.getElementById("carteira").innerHTML = `<strong>R$ ${parseFloat(document.getElementById("inputCarteira").value).toFixed(2)}</strong>`;
        hideBalanceModal();
        showTotalExpenses();
    }
}
function showBalanceModal() {
    document.querySelector(".bg-carteira-modal").style.display = "flex";
}
function hideBalanceModal() {
    document.querySelector(".bg-carteira-modal").style.display = "none";
}

function showTotalExpenses() {
    const database = getDatabase();
    let soma = 0;
    database.forEach((expense) => soma += expense.valor);
    const carteira = parseFloat(document.getElementById("carteira").childNodes[0].innerHTML.substring(2)).toFixed(2);
    if (carteira-soma < 0)
        document.getElementById("totalDespesas").innerHTML = `<strong class="text-danger">-R$ ${Math.abs(parseFloat(carteira-soma).toFixed(2))}</strong>`;
        else
        document.getElementById("totalDespesas").innerHTML = `<strong class="text-success">R$ ${parseFloat(carteira-soma).toFixed(2)}</strong>`;
}

function createChart(expenseList) {
    const chart = new Chart("myChart", {
        type: "bar",
        data: {
            labels: ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"],
            datasets: [{
                backgroundColor: "#15A6D5",
                data: expenseList
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    return chart;
}

function updateChart(chart) {
    chart.data.datasets[0].data = chartData();
    chart.update();
}

// Retorna o valor do objeto armazenado no localStorage para "db_gasto"
function getDatabase() {
    return JSON.parse(localStorage.getItem("db_gasto"));
}

// Retorna a posição do gasto clicado para ser editado
function getExpensePosition(id) {
    const database = getDatabase();
    for (let i = 0; i < database.length; i++)
        if (database[i].id == id) return i;
}

// Retorna o gasto de id informado
function getExpense(id) {
    return getDatabase()[getExpensePosition(id)];
}

// Mostra a tabela por meio da inserção dela no html
function showExpenses(database) {
    // Para remover linhas ta tabela
    document.getElementById("table-gastos").innerHTML = "";

    // Preenche a tabela com informações do bando de dados
    for (i = 0; i < database.length; i++) {
        let gasto = database[i];
        let tableGastos = document.getElementById("table-gastos");
        tableGastos.innerHTML += `
        <tr id='${gasto.id}'>
        <td scope="row">${gasto.id}</td>
        <td>${gasto.periodo}</td>
        <td>${gasto.categoria}</td>
        <td>${gasto.valor}</td>
        <td>${gasto.data}</td>
        <td>${gasto.lembrete}</td>
        </tr>
        `;
    }
}

// Envia os dados do formulário
function submitExpense(e) {
    const database = getDatabase();

    // Retorna o ID do novo gasto, este será maior que o maior ID, em uma unidade
    const getId = (database) => {
        // Caso não haja gastos na tabela, os IDs serão
        // reiniciados e este é o valor inicial
        let id = 1;
        database.forEach((item) => {
            if (item.id >= id)
                id = item.id + 1;
        });
        return id;
    }
    const expense = {
        id: getId(database),
        periodo: inputPeriodo.value,
        categoria: inputCategoria.value,
        valor: parseFloat(inputValor.value),
        data: formatDate(inputData.value),
        lembrete: inputLembrete.value
    }
    insertExpense(database, expense);
    e.preventDefault();
}

// Insere o novo gasto no localStorage
function insertExpense(database, expense) {
    database.push(expense);
    localStorage.setItem("db_gasto", JSON.stringify(database));
    showExpenses(database);
}

// Atualiza o "db_gasto" do localStorage com o gasto atualizado
function updateExpense(id) {
    const database = getDatabase();
    const expense = getExpense(id);
    const updatedExpense = {
        id: expense.id,
        periodo: inputPeriodo.value,
        categoria: inputCategoria.value,
        valor: parseFloat(inputValor.value),
        data: formatDate(inputData.value),
        lembrete: inputLembrete.value
    };
    // Substitui o valor antigo pelo armazenado
    // em updatedExpense
    database[getExpensePosition(id)] = updatedExpense;
    localStorage.setItem("db_gasto", JSON.stringify(database));
    showExpenses(database);
}

// Deleta o gasto que está sendo editado
function deleteExpense(id) {
    const database = getDatabase();
    const index = getExpensePosition(id);
    database.splice(index, 1);
    localStorage.setItem("db_gasto", JSON.stringify(database));
    showExpenses(database);
}

// Mostra os botões no modal
function showButtons(isSubmitting = true) {
    if (isSubmitting) {
        document.getElementById("btnDelete").style.display = "none";
        document.getElementById("btnUpdate").style.display = "none";
        document.getElementById("btnInsert").style.display = "inline";
        document.querySelector(".modal-content h1").innerHTML = "Nova despesa";
    } else {
        document.getElementById("btnDelete").style.display = "inline";
        document.getElementById("btnUpdate").style.display = "inline";
        document.getElementById("btnInsert").style.display = "none";
        document.querySelector(".modal-content h1").innerHTML = "Editar despesa";
    }
}

// Mostra o modal
// Se o parâmetro for false, mostra o modal de Novo Gasto
// caso contrário mostral o modal de Editar Gasto
function showModal(isEditing = false) {
    if (isEditing) {
        showButtons(false);
        document.querySelector("#buttonRow > div").classList.remove("justify-content-end");
        document.querySelector("#buttonRow > div").classList.add("justify-content-between");
    } else {
        showButtons();
        document.querySelector("#buttonRow > div").classList.remove("justify-content-between");
        document.querySelector("#buttonRow > div").classList.add("justify-content-end");
    }
    document.querySelector(".bg-modal").style.display = "flex";
}

// Esconde o modal e limpa os campos do formulário
function hideModal() {
    document.querySelector(".bg-modal").style.display = "none";
    inputPeriodo.value = "";
    inputCategoria.value = "";
    inputValor.value = "";
    inputData.value = "";
    inputLembrete.value = "";
}

// Preenche o modal com os dados do gasto selecionado
function fillModal(id) {
    const expense = getExpense(id);

    // Preenche os campos com os dados já existentes
    inputPeriodo.value = expense.periodo;
    inputCategoria.value = expense.categoria;
    inputValor.value = expense.valor;
    inputData.value = formatDate(expense.data);
    inputLembrete.value = expense.lembrete;
}

// Muda o formato da data de [aaaa-mm-dd] para [dd/mm/aaaa] ou vice e versa
function formatDate(date) {
    const dateLength = date.length;
    if (date.includes("-")) {
        const day = date.substring(dateLength - 2, dateLength);
        const month = date.substring(dateLength - 5, dateLength - 3);
        const year = date.substring(0, dateLength - 6);
        return `${day}/${month}/${year}`;
    } else {
        const day = date.substring(0, 2);
        const month = date.substring(3, 5);
        const year = date.substring(6, dateLength);
        return `${year}-${month}-${day}`;
    }
}

// Retorna um array dos gastos de cada mês de um certo ano
// Se o parâmetro for "all", o array terá os gastos mensais de todos os anos
function chartData(year = "all") {
    const database = getDatabase();
    const monthlyExpenses = []
    for (let i = 0; i < 12; i++)
        monthlyExpenses.push(0);
    database.forEach((expense) => {
        if (expense.data.substring(6, expense.data.length) == year || year === "all") {
            monthlyExpenses[parseInt(expense.data.substring(3, 5)) - 1] += parseFloat(expense.valor);
        }
    });
    return monthlyExpenses;
}

// Sai da carteira 
function initPage() {

    document.getElementById('btn_logout').addEventListener('click', logoutUser);

    document.getElementById('nomeUsuario').innerHTML = usuarioCorrente.nome;

    exibeUsuarios();
}
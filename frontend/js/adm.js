const apiProdutos = "http://172.20.10.2:5000/api/Produto";//mudar isso dependendo do wifi que estiver usando, só ir no cmd e digitar ipconfig e pegar o ipv4
const apiMesas = "http://172.20.10.2:5000/api/Mesa";//mudar isso dependendo do wifi que estiver usando, só ir no cmd e digitar ipconfig e pegar o ipv4

async function carregarProdutos() {
    const container = document.getElementById("produtosContainer");
    container.innerHTML = "Carregando...";

    try {
        const res = await fetch(apiProdutos);
        const data = await res.json();
        const produtos = Array.isArray(data) ? data : data.$values || [];

        console.log("Produtos recebidos:", produtos);

        if (!produtos.length) {
            container.innerHTML = "<p class='empty-state'>Nenhum produto cadastrado.</p>";
            return;
        }

        container.innerHTML = `
            <div class="card-grid">
                ${produtos.map(p => `
                    <div class="adm-card">
                        <h3>Produto #${p.id}</h3>

                        <label>Nome</label>
                        <input value="${p.nomeProduto}" id="nome-${p.id}">

                        <label>Categoria</label>
                        <input value="${p.categoria}" id="categoria-${p.id}">

                        <label>Preço</label>
                        <input type="number" step="0.01" value="${p.preco}" id="preco-${p.id}">

                        <div class="card-actions">
                            <button class="btn btn-success" onclick="editarProduto(${p.id})">Salvar</button>
                            <button class="btn btn-danger" onclick="deletarProduto(${p.id})">Excluir</button>
                        </div>
                    </div>
                `).join("")}
            </div>`;

    } catch (e) {
        console.error("Erro ao carregar produtos:", e);
        container.innerHTML = "<p class='empty-state'>Erro ao carregar produtos.</p>";
    }
}

async function cadastrarProduto() {
    const nome = document.getElementById("nomeProduto").value;
    const categoria = document.getElementById("categoriaProduto").value;
    const preco = parseFloat(document.getElementById("precoProduto").value);

    if (!nome || !categoria || isNaN(preco)) {
        createToast("Preencha todos os campos!", "error");
        return;
    }

    const novoProduto = { nomeProduto: nome, categoria, preco };

    const res = await fetch(apiProdutos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto)
    });

    if (res.ok) {
        createToast("Produto cadastrado!");
        carregarProdutos();
    } else {
        createToast("Erro ao cadastrar", "error");
    }
}

async function editarProduto(id) {
    const nome = document.getElementById(`nome-${id}`).value;
    const categoria = document.getElementById(`categoria-${id}`).value;
    const preco = parseFloat(document.getElementById(`preco-${id}`).value);

    const produtoEditado = { nomeProduto: nome, categoria, preco };

    const res = await fetch(`${apiProdutos}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoEditado)
    });

    if (res.ok) {
        createToast("Produto atualizado!");
        carregarProdutos();
    } else {
        createToast("Erro ao atualizar!", "error");
    }
}

async function deletarProduto(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const res = await fetch(`${apiProdutos}/${id}`, { method: "DELETE" });

    if (res.ok) {
        createToast("Produto excluído!");
        carregarProdutos();
    } else {
        createToast("Erro ao excluir!", "error");
    }
}

async function carregarMesas() {
    const container = document.getElementById("mesasContainer");
    container.innerHTML = "Carregando...";

    try {
        const res = await fetch(apiMesas);
        const data = await res.json();
        const mesas = Array.isArray(data) ? data : data.$values || [];

        console.log("Mesas recebidas:", mesas);

        if (!mesas.length) {
            container.innerHTML = "<p class='empty-state'>Nenhuma mesa cadastrada.</p>";
            return;
        }

        container.innerHTML = `
        <div class="card-grid">
            ${mesas.map(m => `
                <div class="adm-card">
                    <h3>Mesa #${m.id}</h3>

                    <label>Número da Mesa</label>
                    <input type="number" value="${m.numeroMesa}" id="numero-${m.id}">

                    <label>Qtd. Clientes</label>
                    <input type="number" value="${m.quantidadeClientes}" id="quantidade-${m.id}">

                    <label>Status</label>
                    <select id="status-${m.id}">
                        <option value="livre" ${m.statusMesa === 'livre' ? 'selected' : ''}>Livre</option>
                        <option value="ocupada" ${m.statusMesa === 'ocupada' ? 'selected' : ''}>Ocupada</option>
                    </select>

                    <div class="card-actions">
                        <button class="btn btn-success" onclick="editarMesa(${m.id})">Salvar</button>
                        <button class="btn btn-danger" onclick="deletarMesa(${m.id})">Excluir</button>
                    </div>
                </div>
            `).join("")}
        </div>`;

    } catch (e) {
        console.error("Erro ao carregar mesas:", e);
        container.innerHTML = "<p class='empty-state'>Erro ao carregar mesas.</p>";
    }
}

async function cadastrarMesa() {
    const numero = parseInt(document.getElementById("numeroMesa").value);
    const quantidade = parseInt(document.getElementById("quantidadeClientes").value);
    const status = document.getElementById("statusMesa").value;

    if (isNaN(numero) || isNaN(quantidade)) {
        createToast("Preencha todos os campos!", "error");
        return;
    }

    const novaMesa = { numeroMesa: numero, quantidadeClientes: quantidade, statusMesa: status };

    const res = await fetch(apiMesas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaMesa)
    });

    if (res.ok) {
        createToast("Mesa cadastrada!");
        carregarMesas();
    } else {
        createToast("Erro ao cadastrar mesa", "error");
    }
}

async function editarMesa(id) {
    const numero = parseInt(document.getElementById(`numero-${id}`).value);
    const quantidade = parseInt(document.getElementById(`quantidade-${id}`).value);
    const status = document.getElementById(`status-${id}`).value;

    const mesaEditada = { numeroMesa: numero, quantidadeClientes: quantidade, statusMesa: status };

    const res = await fetch(`${apiMesas}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mesaEditada)
    });

    if (res.ok) {
        createToast("Mesa atualizada!");
        carregarMesas();
    } else {
        createToast("Erro ao atualizar mesa!", "error");
    }
}

async function deletarMesa(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const res = await fetch(`${apiMesas}/${id}`, { method: "DELETE" });

    if (res.ok) {
        createToast("Mesa excluída!");
        carregarMesas();
    } else {
        createToast("Erro ao excluir mesa!", "error");
    }
}

carregarProdutos();
carregarMesas();
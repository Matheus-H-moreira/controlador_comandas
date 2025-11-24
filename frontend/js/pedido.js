const apiProdutos = "http://192.168.5.179:5000/api/Produto";//mudar isso dependendo do wifi que estiver usando, só ir no cmd e digitar ipconfig e pegar o ipv4
const apiMesas = "http://192.168.5.179:5000/api/Mesa";//mudar isso dependendo do wifi que estiver usando, só ir no cmd e digitar ipconfig e pegar o ipv4
const apiComandas = "http://192.168.5.179:5000/api/Comandas";//mudar isso dependendo do wifi que estiver usando, só ir no cmd e digitar ipconfig e pegar o ipv4

let clientes = [];
let clienteSelecionado = null;

async function carregarCardapio() {
    const container = document.getElementById("cardapioContainer");
    container.innerHTML = "<p>Carregando cardápio...</p>";

    try {
        const res = await fetch(apiProdutos);
        const data = await res.json();
        const produtos = Array.isArray(data) ? data : data.$values || [];

        if (!produtos.length) {
            container.innerHTML = "<p class='empty-state'>Nenhum produto encontrado.</p>";
            return;
        }

        container.innerHTML = produtos.map(p => `
            <div class="card card-produto" onclick="abrirModalProduto(${p.id}, '${p.nomeProduto}', ${p.preco})">
                <h4>${p.nomeProduto}</h4>
                <p class="categoria">${p.categoria}</p>
                <p class="preco">R$ ${Number(p.preco).toFixed(2)}</p>
            </div>
        `).join("");
    } catch (e) {
        console.error("Erro ao carregar cardápio:", e);
        container.innerHTML = `<p class="empty-state">Erro ao carregar cardápio.</p>`;
    }
}

async function carregarMesas() {
    const select = document.getElementById("selectMesa");
    select.innerHTML = `<option value="">-- Selecione uma mesa --</option>`;

    try {
        const res = await fetch(apiMesas);
        const data = await res.json();
        const mesas = Array.isArray(data) ? data : data.$values || [];

        mesas.forEach(mesa => {
            const option = document.createElement("option");
            option.value = mesa.id;
            option.textContent = `Mesa ${mesa.numeroMesa} (${mesa.quantidadeClientes} clientes)`;
            select.appendChild(option);
        });
    } catch (e) {
        console.error("Erro ao carregar mesas:", e);
        select.innerHTML = `<option value="">Erro ao carregar mesas</option>`;
    }
}

document.getElementById("selectMesa").addEventListener("change", carregarClientesDaMesa);

async function carregarClientesDaMesa() {
    const mesaId = document.getElementById("selectMesa").value;
    if (!mesaId) return;

    const res = await fetch(`${apiComandas}?mesaId=${mesaId}`);
    const comandas = await res.json();

    clientes = comandas.map(c => ({
        nome: c.nomeCliente,
        id: c.id,
        pedidos: []
    }));

    atualizarSelectCliente();
}

document.getElementById("quantidadePessoas").addEventListener("input", () => {
    const qtd = parseInt(document.getElementById("quantidadePessoas").value) || 0;
    const container = document.getElementById("clientesContainer");
    container.innerHTML = "";
    clientes = [];

    for (let i = 0; i < qtd; i++) {
        const div = document.createElement("div");
        div.className = "form-group";
        div.innerHTML = `
            <label>Nome do Cliente ${i + 1}:</label>
            <input type="text" id="cliente-${i}" placeholder="Nome do cliente">
        `;
        container.appendChild(div);
        clientes.push({ nome: "", id: null, pedidos: [] });
    }
});

document.getElementById("btnSalvarClientes").addEventListener("click", async () => {
    const mesaId = parseInt(document.getElementById("selectMesa").value);
    if (!mesaId) {
        alert("Selecione uma mesa primeiro");
        return;
    }

    const inputs = clientes.map((_, i) => document.getElementById(`cliente-${i}`).value.trim());
    const resList = await fetch(`${apiComandas}?mesaId=${mesaId}`);
    const comandasExistentes = await resList.json();

    for (let nome of inputs) {
        let encontrada = comandasExistentes.find(c => c.nomeCliente === nome);

        if (encontrada) {
            clientes.push({ nome, id: encontrada.id, pedidos: [] });
            continue;
        }

        const res = await fetch(apiComandas, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mesaId, nomeCliente: nome })
        });

        if (res.status === 409) {
            alert(`Já existe uma comanda para ${nome} nessa mesa`);
            continue;
        }

        const data = await res.json();
        clientes.push({ nome: data.nomeCliente, id: data.id, pedidos: [] });
    }

    atualizarSelectCliente();
});

function atualizarSelectCliente() {
    const select = document.getElementById("selectCliente");
    select.innerHTML = '<option value="">-- Selecione um cliente --</option>';

    clientes.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
    });

    atualizarItensAdicionados();
}

document.getElementById("selectCliente").addEventListener("change", e => {
    const id = parseInt(e.target.value);
    clienteSelecionado = clientes.find(c => c.id === id);
    atualizarItensAdicionados();
});


function atualizarItensAdicionados() {
    const ul = document.getElementById("itensAdicionados");
    ul.innerHTML = "";

    if (!clienteSelecionado || !clienteSelecionado.pedidos.length) {
        ul.innerHTML = `<li class="empty-state" style="list-style: none; padding: 2rem; text-align: center; color: var(--text-muted);">
            Nenhum item adicionado ainda
        </li>`;
        return;
    }

    clienteSelecionado.pedidos.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nomeProduto} - ${item.quantidade}x - R$ ${(item.preco * item.quantidade).toFixed(2)}`;
        ul.appendChild(li);
    });
}

function abrirModalProduto(id, nomeProduto, preco) {
    const modal = document.getElementById("modalAcrescimos");
    modal.style.display = "block";

    const quantidadeInput = document.getElementById("modalQuantidade");
    const modalTotal = document.getElementById("modalTotal");
    document.getElementById("modalProdutoInfo").textContent = `${nomeProduto} - R$ ${preco.toFixed(2)}`;
    quantidadeInput.value = 1;
    modalTotal.innerHTML = `<strong style="color: var(--cor-amarelo); font-size: 1.2rem;">Total: R$ ${preco.toFixed(2)}</strong>`;

    quantidadeInput.oninput = () => {
        const qtd = parseInt(quantidadeInput.value) || 1;
        modalTotal.innerHTML = `<strong style="color: var(--cor-amarelo); font-size: 1.2rem;">Total: R$ ${(preco * qtd).toFixed(2)}</strong>`;
    };

    document.getElementById("btnAdicionarModal").onclick = () => {
        const qtd = parseInt(quantidadeInput.value) || 1;
        if (!clienteSelecionado) {
            alert("Selecione um cliente primeiro");
            return;
        }
        const existente = clienteSelecionado.pedidos.find(p => p.produtoId === id);
        if (existente) {
            existente.quantidade += qtd;
        } else {
            clienteSelecionado.pedidos.push({ produtoId: id, nomeProduto, quantidade: qtd, preco });
        }
        atualizarItensAdicionados();
        modal.style.display = "none";
    };
}

function fecharModalAcrescimos() {
    document.getElementById("modalAcrescimos").style.display = "none";
}

document.getElementById("btnEnviarPedidos").addEventListener("click", async () => {
    if (!clientes.length) {
        alert("Não há clientes cadastrados!");
        return;
    }

    try {
        for (let cliente of clientes) {
            if (!cliente.pedidos.length) continue;

            for (let item of cliente.pedidos) {
                await fetch("http://192.168.5.179:5000/api/ItensComanda", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ComandaId: cliente.id,
                        ItemPedido: item.nomeProduto,
                        QuantidadeItem: item.quantidade,
                        PrecoItem: item.preco
                    })
                });
            }
        }

        alert("Pedidos enviados para a cozinha!");
        clientes.forEach(c => c.pedidos = []);
        atualizarItensAdicionados();
    } catch (e) {
        console.error(e);
        alert("Erro ao enviar pedidos!");
    }
});

window.onload = () => {
    carregarCardapio();
    carregarMesas();
};

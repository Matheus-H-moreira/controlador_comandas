const apiMesas = "http://192.168.5.179:5000/api/Mesa";//mudar isso dependendo do wifi que estiver usando, só ir no cmd e digitar ipconfig e pegar o ipv4
const apiComandas = "http://192.168.5.179:5000/api/Comandas/mesa"; //mudar isso dependendo do wifi que estiver usando, só ir no cmd e digitar ipconfig e pegar o ipv4
const apiItensComanda = "http://192.168.5.179:5000/api/ItensComanda/comanda";//mudar isso dependendo do wifi que estiver usando, só ir no cmd e digitar ipconfig e pegar o ipv4

let clientes = [];
let mesaSelecionada = null;
let clienteSelecionado = null;

async function carregarMesas() {
    const select = document.getElementById("selectMesaCaixa");
    select.innerHTML = `<option value="">-- Selecione uma mesa --</option>`;
    try {
        const res = await fetch(apiMesas);
        const data = await res.json();
        const mesas = data.$values || data;

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

document.getElementById("selectMesaCaixa").addEventListener("change", async (e) => {
    mesaSelecionada = parseInt(e.target.value) || null;
    clienteSelecionado = null;

    const clienteGroup = document.getElementById("clienteGroup");
    const selectCliente = document.getElementById("selectClienteCaixa");
    selectCliente.innerHTML = `<option value="">-- Pagar toda a mesa --</option>`;
    clientes = [];

    if (!mesaSelecionada) {
        clienteGroup.style.display = "none";
        document.getElementById("resumoContainer").innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`${apiComandas}/${mesaSelecionada}`);
        const data = await res.json();
        clientes = data.$values || data;

        if (clientes.length) {
            clientes.forEach(c => {
                const option = document.createElement("option");
                option.value = c.id;
                option.textContent = c.nomeCliente;
                selectCliente.appendChild(option);
            });
            clienteGroup.style.display = "block";
        } else {
            clienteGroup.style.display = "none";
        }

        atualizarResumo();
    } catch (e) {
        console.error("Erro ao carregar clientes:", e);
        clienteGroup.style.display = "none";
    }
});

document.getElementById("selectClienteCaixa").addEventListener("change", (e) => {
    const clienteId = parseInt(e.target.value);
    clienteSelecionado = clientes.find(c => c.id === clienteId) || null;
    atualizarResumo();
});

async function atualizarResumo() {
    const container = document.getElementById("resumoContainer");
    container.innerHTML = `<div class="empty-state">Carregando resumo...</div>`;

    if (!mesaSelecionada) {
        container.innerHTML = "";
        return;
    }

    try {
        const comandasParaResumo = clienteSelecionado ? [clienteSelecionado] : clientes;
        let resumoHTML = "";

        for (let comanda of comandasParaResumo) {
            const resItens = await fetch(`${apiItensComanda}/${comanda.id}`);
            const dataItens = await resItens.json();
            const itens = dataItens.$values || dataItens;

            if (itens.length) {
                const total = itens.reduce((sum, i) => sum + i.precoItem * i.quantidadeItem, 0);
                const itensHTML = itens.map(i => `<li>${i.itemPedido} - ${i.quantidadeItem}x - R$ ${(i.precoItem * i.quantidadeItem).toFixed(2)}</li>`).join("");

                resumoHTML += `
                    <div class="card" style="margin-bottom: 1rem;">
                        <h3>${comanda.nomeCliente}</h3>
                        <ul>${itensHTML}</ul>
                        <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
                    </div>
                `;
            } else {
                resumoHTML += `<div class="empty-state">Nenhum item para ${comanda.nomeCliente}</div>`;
            }
        }

        resumoHTML += `<button id="btnFecharMesa" class="btn btn-success" style="margin-top:1rem;">💳 Fechar Pagamento</button>`;
        container.innerHTML = resumoHTML;

        document.getElementById("btnFecharMesa").addEventListener("click", fecharPagamento);

    } catch (e) {
        console.error("Erro ao carregar resumo:", e);
        container.innerHTML = `<div class="empty-state">Erro ao carregar resumo</div>`;
    }
}

async function fecharPagamento() {
    if (!mesaSelecionada) return;

    const confirmMsg = clienteSelecionado
        ? `Deseja realmente pagar apenas o cliente ${clienteSelecionado.nomeCliente}?`
        : "Deseja realmente pagar toda a mesa?";

    if (!confirm(confirmMsg)) return;

    try {
        if (clienteSelecionado) {
            await fetch(`http://192.168.5.179:5000/api/Comandas/${clienteSelecionado.id}`, { method: "DELETE" });
        } else {
            for (let c of clientes) {
                await fetch(`http://192.168.5.179:5000/api/Comandas/${c.id}`, { method: "DELETE" });
            }
        }

        alert("Pagamento realizado com sucesso!");
        document.getElementById("resumoContainer").innerHTML = "";
        document.getElementById("selectClienteCaixa").innerHTML = `<option value="">-- Pagar toda a mesa --</option>`;
        document.getElementById("clienteGroup").style.display = "none";
        await carregarMesas();
    } catch (e) {
        console.error("Erro ao processar pagamento:", e);
        alert("Erro ao processar pagamento!");
    }
}

window.onload = () => {
    carregarMesas();
};

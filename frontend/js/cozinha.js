const apiComandas = "http://localhost:5000/api/Comandas/todos";
const apiItensComanda = "http://localhost:5000/api/ItensComanda/comanda";

async function carregarPedidos() {
    const container = document.getElementById("pedidosContainer");

    container.innerHTML = `<div class="empty-state">Carregando pedidos...</div>`;

    try {
        const resComandas = await fetch(apiComandas);
        const data = await resComandas.json();
        let comandas = data.$values || data;

        comandas = comandas.filter(c => !c.status || c.status === "em_preparo");

        if (!comandas.length) {
            container.innerHTML = `<div class="empty-state">Nenhum pedido encontrado</div>`;
            return;
        }

        container.innerHTML = "";

        for (let comanda of comandas) {
            const resItens = await fetch(`${apiItensComanda}/${comanda.id}`);
            const dataItens = await resItens.json();
            const itens = dataItens.$values || dataItens;

            if (!itens.length) continue;

            let itensHTML = "";
            let total = 0;

            itensHTML = itens.map(i => {
                total += i.precoItem * i.quantidadeItem;
                return `<li>${i.itemPedido} - ${i.quantidadeItem}x - R$ ${(i.precoItem * i.quantidadeItem).toFixed(2)}</li>`;
            }).join("");


            const card = document.createElement("div");
            card.className = "card";
            card.style.marginBottom = "1rem";

            card.innerHTML = `
                <h3>${comanda.nomeCliente}</h3>
                <ul>${itensHTML}</ul>
                <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
                <button class="btn btn-success btn-finalizar">✅ Finalizar Pedido</button>
            `;

            card.querySelector(".btn-finalizar").addEventListener("click", async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/Comandas/finalizar/${comanda.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" }
                    });

                    if (!res.ok) {
                        console.error("Erro ao finalizar comanda:", res.status, res.statusText);
                        alert("Erro ao finalizar pedido!");
                        return;
                    }

                    card.remove();
                    console.log(`Pedido ${comanda.id} finalizado com sucesso.`);

                } catch (e) {
                    console.error("Erro na requisição:", e);
                    alert("Erro ao finalizar pedido!");
                }
            });

            container.appendChild(card);
        }
    } catch (e) {
        console.error(e);
        container.innerHTML = `<div class="empty-state">Erro ao carregar pedidos</div>`;
    }
}

window.onload = () => {
    carregarPedidos();
    const btnAtualizar = document.getElementById("btnAtualizar");
    if (btnAtualizar) {
        btnAtualizar.onclick = carregarPedidos;
    }
};

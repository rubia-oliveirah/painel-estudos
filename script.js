```javascript
const input = document.getElementById("assuntoInput");
const botao = document.getElementById("adicionarBtn");
const lista = document.getElementById("listaEstudos");
const progresso = document.getElementById("progresso");

let estudos = [];

function mostrarEstudos() {
    lista.innerHTML = "";

    estudos.forEach((estudo, indice) => {
        const item = document.createElement("li");

        item.innerHTML = `
            <label>
                <input 
                    type="checkbox" 
                    ${estudo.concluido ? "checked" : ""}
                    onchange="marcarConcluido(${indice})"
                >
                ${estudo.nome}
            </label>
        `;

        lista.appendChild(item);
    });

    atualizarProgresso();
}

function adicionarEstudo() {
    const nome = input.value.trim();

    if (nome === "") {
        alert("Digite um assunto para adicionar.");
        return;
    }

    estudos.push({
        nome: nome,
        concluido: false
    });

    input.value = "";

    mostrarEstudos();
}

function marcarConcluido(indice) {
    estudos[indice].concluido = !estudos[indice].concluido;

    mostrarEstudos();
}

function atualizarProgresso() {
    if (estudos.length === 0) {
        progresso.textContent = "0% concluído";
        return;
    }

    const concluidos = estudos.filter(estudo => estudo.concluido).length;

    const porcentagem = Math.round(
        (concluidos / estudos.length) * 100
    );

    progresso.textContent = `${porcentagem}% concluído`;
}

botao.addEventListener("click", adicionarEstudo);
```

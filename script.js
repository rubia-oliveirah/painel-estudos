const input = document.getElementById("assuntoInput");
const botao = document.getElementById("adicionarBtn");
const lista = document.getElementById("listaEstudos");
const progresso = document.getElementById("progresso");

let estudos = [];

function mostrarEstudos() {
    lista.innerHTML = "";

    estudos.forEach(function(estudo, indice) {
        const item = document.createElement("li");

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = estudo.concluido;

        checkbox.addEventListener("change", function() {
            marcarConcluido(indice);
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + estudo.nome));

        const excluir = document.createElement("button");
        excluir.textContent = "🗑️";
        excluir.title = "Excluir assunto";

        excluir.addEventListener("click", function() {
            excluirEstudo(indice);
        });

        item.appendChild(label);
        item.appendChild(excluir);

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

function excluirEstudo(indice) {
    estudos.splice(indice, 1);

    mostrarEstudos();
}

function atualizarProgresso() {
    if (estudos.length === 0) {
        progresso.textContent = "0% concluído";
        return;
    }

    const concluidos = estudos.filter(function(estudo) {
        return estudo.concluido;
    }).length;

    const porcentagem = Math.round(
        (concluidos / estudos.length) * 100
    );

    progresso.textContent = porcentagem + "% concluído";
}

botao.addEventListener("click", adicionarEstudo);

const input = document.getElementById("assuntoInput");
const botao = document.getElementById("adicionarBtn");
const lista = document.getElementById("listaEstudos");
const progresso = document.getElementById("progresso");

const CHAVE_STORAGE = "conectaSeguroEstudos";

let estudos = JSON.parse(
    localStorage.getItem(CHAVE_STORAGE)
) || [];

function salvarEstudos() {
    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(estudos)
    );
}

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

        const nome = document.createElement("span");
        nome.textContent = estudo.nome;

        if (estudo.concluido) {
            nome.className = "estudoConcluido";
        }

        label.appendChild(checkbox);
        label.appendChild(nome);

        const excluir = document.createElement("button");
        excluir.innerHTML = "&#128465;";
        excluir.className = "botaoExcluir";
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

    salvarEstudos();

    input.value = "";

    mostrarEstudos();
}

function marcarConcluido(indice) {
    estudos[indice].concluido = !estudos[indice].concluido;

    salvarEstudos();

    mostrarEstudos();
}

function excluirEstudo(indice) {
    const confirmar = confirm(
        'Tem certeza que deseja excluir "' + estudos[indice].nome + '"?'
    );

    if (!confirmar) {
        return;
    }

    estudos.splice(indice, 1);

    salvarEstudos();

    mostrarEstudos();
}

function atualizarProgresso() {
    if (estudos.length === 0) {
        progresso.innerHTML =
            '<div class="circuloProgresso">' +
                '<strong>0%</strong>' +
                '<span>concluído</span>' +
            '</div>';

        return;
    }

    const concluidos = estudos.filter(function(estudo) {
        return estudo.concluido;
    }).length;

    const porcentagem = Math.round(
        (concluidos / estudos.length) * 100
    );

    progresso.innerHTML =
        '<div class="circuloProgresso" style="--progresso: ' +
        porcentagem +
        '%;">' +
            '<strong>' + porcentagem + '%</strong>' +
            '<span>concluído</span>' +
        '</div>';

    if (porcentagem === 100) {
        progresso.innerHTML +=
            '<div class="mensagemParabens">' +
                '<span>✓</span>' +
                ' Parabéns! Você concluiu todos os assuntos!' +
            '</div>';
    }
}

botao.addEventListener("click", adicionarEstudo);

input.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        adicionarEstudo();
    }
});

mostrarEstudos();

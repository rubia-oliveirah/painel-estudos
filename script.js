const input = document.getElementById("assuntoInput");
const botao = document.getElementById("adicionarBtn");
const lista = document.getElementById("listaEstudos");
const progresso = document.getElementById("progresso");

const excluirSelecionadosBtn = document.getElementById(
    "excluirSelecionadosBtn"
);

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

        /* Área esquerda */
        const areaEsquerda = document.createElement("label");

        /* Checkbox de conclusão */
        const checkboxConcluido = document.createElement("input");
        checkboxConcluido.type = "checkbox";
        checkboxConcluido.checked = estudo.concluido;

        checkboxConcluido.addEventListener("change", function() {
            marcarConcluido(indice);
        });

        const nome = document.createElement("span");
        nome.textContent = estudo.nome;

        if (estudo.concluido) {
            nome.className = "estudoConcluido";
        }

        areaEsquerda.appendChild(checkboxConcluido);
        areaEsquerda.appendChild(nome);

        /* Área direita */
        const areaDireita = document.createElement("div");
        areaDireita.className = "menuAcoes";

        /* Checkbox de seleção para exclusão */
        const selecionar = document.createElement("input");
        selecionar.type = "checkbox";
        selecionar.className = "checkboxSelecao";
        selecionar.dataset.indice = indice;
        selecionar.title = "Selecionar assunto";

        selecionar.addEventListener("change", function() {
            atualizarBotaoExcluir();
        });

        /* Botão de três pontos */
        const menuBotao = document.createElement("button");
        menuBotao.textContent = "⋮";
        menuBotao.className = "menuBotao";
        menuBotao.title = "Mais opções";

        /* Menu */
        const menu = document.createElement("div");
        menu.className = "menuOpcoes";
        menu.style.display = "none";

        /* Botão Editar */
        const editar = document.createElement("button");
        editar.textContent = "✏️ Editar";

        editar.addEventListener("click", function() {
            editarEstudo(indice);
            menu.style.display = "none";
        });

        /* Botão Excluir */
        const excluir = document.createElement("button");
        excluir.textContent = "🗑️ Excluir";

        excluir.addEventListener("click", function() {
            excluirEstudo(indice);
            menu.style.display = "none";
        });

        menu.appendChild(editar);
        menu.appendChild(excluir);

        /* Abrir/fechar menu */
        menuBotao.addEventListener("click", function(evento) {
            evento.stopPropagation();

            const menusAbertos =
                document.querySelectorAll(".menuOpcoes");

            menusAbertos.forEach(function(outroMenu) {
                if (outroMenu !== menu) {
                    outroMenu.style.display = "none";
                }
            });

            menu.style.display =
                menu.style.display === "none"
                    ? "block"
                    : "none";
        });

        areaDireita.appendChild(selecionar);
        areaDireita.appendChild(menuBotao);
        areaDireita.appendChild(menu);

        item.appendChild(areaEsquerda);
        item.appendChild(areaDireita);

        lista.appendChild(item);
    });

    atualizarBotaoExcluir();
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
    estudos[indice].concluido =
        !estudos[indice].concluido;

    salvarEstudos();

    mostrarEstudos();
}

function editarEstudo(indice) {
    const novoNome = prompt(
        "Digite o novo nome do assunto:",
        estudos[indice].nome
    );

    if (novoNome === null) {
        return;
    }

    const nomeLimpo = novoNome.trim();

    if (nomeLimpo === "") {
        alert("O nome do assunto não pode ficar vazio.");
        return;
    }

    estudos[indice].nome = nomeLimpo;

    salvarEstudos();

    mostrarEstudos();
}

function excluirEstudo(indice) {
    const confirmar = confirm(
        'Tem certeza que deseja excluir "' +
        estudos[indice].nome +
        '"?'
    );

    if (!confirmar) {
        return;
    }

    estudos.splice(indice, 1);

    salvarEstudos();

    mostrarEstudos();
}

function atualizarBotaoExcluir() {
    const checkboxes =
        document.querySelectorAll(".checkboxSelecao");

    let quantidadeSelecionada = 0;

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            quantidadeSelecionada++;
        }
    });

    if (quantidadeSelecionada >= 2) {
        excluirSelecionadosBtn.style.display = "block";

        excluirSelecionadosBtn.textContent =
            "Excluir " +
            quantidadeSelecionada +
            " selecionados";
    } else {
        excluirSelecionadosBtn.style.display = "none";
    }
}

function excluirSelecionados() {
    const checkboxes =
        document.querySelectorAll(".checkboxSelecao");

    const indicesSelecionados = [];

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            indicesSelecionados.push(
                Number(checkbox.dataset.indice)
            );
        }
    });

    if (indicesSelecionados.length < 2) {
        return;
    }

    const confirmar = confirm(
        "Tem certeza que deseja excluir " +
        indicesSelecionados.length +
        " assuntos?"
    );

    if (!confirmar) {
        return;
    }

    estudos = estudos.filter(function(estudo, indice) {
        return !indicesSelecionados.includes(indice);
    });

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
            '<strong>' +
                porcentagem +
                '%' +
            '</strong>' +
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

/* Botão Adicionar */
botao.addEventListener(
    "click",
    adicionarEstudo
);

/* Tecla Enter */
input.addEventListener(
    "keydown",
    function(evento) {
        if (evento.key === "Enter") {
            adicionarEstudo();
        }
    }
);

/* Excluir selecionados */
excluirSelecionadosBtn.addEventListener(
    "click",
    excluirSelecionados
);

/* Carregar estudos salvos */
mostrarEstudos();

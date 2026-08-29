const input = document.getElementById("assuntoInput");
const botao = document.getElementById("adicionarBtn");
const lista = document.getElementById("listaEstudos");
const progresso = document.getElementById("progresso");

const modoSelecaoBtn =
    document.getElementById("modoSelecaoBtn");

const marcarTodosBtn =
    document.getElementById("marcarTodosBtn");

const excluirSelecionadosBtn =
    document.getElementById("excluirSelecionadosBtn");


const CHAVE_STORAGE =
    "conectaSeguroEstudos";


let estudos =
    JSON.parse(
        localStorage.getItem(CHAVE_STORAGE)
    ) || [];


let modoSelecao = false;

let selecionados = [];


/* =========================
   SALVAR
========================= */

function salvarEstudos() {

    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(estudos)
    );

}


/* =========================
   MOSTRAR ESTUDOS
========================= */

function mostrarEstudos() {

    lista.innerHTML = "";


    estudos.forEach(function(estudo, indice) {

        const item =
            document.createElement("li");


        /* ÁREA ESQUERDA */

        const areaEsquerda =
            document.createElement("label");

        areaEsquerda.className =
            "areaEstudo";


        /* Checkbox de conclusão */

        const checkboxConcluido =
            document.createElement("input");

        checkboxConcluido.type =
            "checkbox";

        checkboxConcluido.checked =
            estudo.concluido;


        checkboxConcluido.addEventListener(
            "change",
            function() {

                marcarConcluido(indice);

            }
        );


        /* Nome */

        const nome =
            document.createElement("span");

        nome.textContent =
            estudo.nome;


        if (estudo.concluido) {

            nome.className =
                "estudoConcluido";

        }


        areaEsquerda.appendChild(
            checkboxConcluido
        );

        areaEsquerda.appendChild(
            nome
        );


        /* ÁREA DIREITA */

        const areaDireita =
            document.createElement("div");

        areaDireita.className =
            "areaDireita";


        /* Checkbox de seleção */

        if (modoSelecao) {

            const checkboxSelecao =
                document.createElement("input");

            checkboxSelecao.type =
                "checkbox";

            checkboxSelecao.className =
                "checkboxSelecao";

            checkboxSelecao.checked =
                selecionados.includes(indice);


            checkboxSelecao.addEventListener(
                "change",
                function() {

                    if (
                        checkboxSelecao.checked
                    ) {

                        if (
                            !selecionados.includes(
                                indice
                            )
                        ) {

                            selecionados.push(
                                indice
                            );

                        }

                    } else {

                        selecionados =
                            selecionados.filter(
                                function(item) {

                                    return item !== indice;

                                }
                            );

                    }


                    atualizarControlesSelecao();

                }
            );


            areaDireita.appendChild(
                checkboxSelecao
            );

        }


        /* MENU ⋮ */

        const menuAcoes =
            document.createElement("div");

        menuAcoes.className =
            "menuAcoes";


        const menuBotao =
            document.createElement("button");

        menuBotao.textContent =
            "⋮";

        menuBotao.className =
            "menuBotao";

        menuBotao.title =
            "Mais opções";


        const menu =
            document.createElement("div");

        menu.className =
            "menuOpcoes";

        menu.style.display =
            "none";


        /* EDITAR */

        const editar =
            document.createElement("button");

        editar.textContent =
            "✏️ Editar";


        editar.addEventListener(
            "click",
            function() {

                editarEstudo(indice);

                menu.style.display =
                    "none";

            }
        );


        /* EXCLUIR */

        const excluir =
            document.createElement("button");

        excluir.textContent =
            "🗑️ Excluir";


        excluir.addEventListener(
            "click",
            function() {

                excluirEstudo(indice);

                menu.style.display =
                    "none";

            }
        );


        menu.appendChild(
            editar
        );

        menu.appendChild(
            excluir
        );


        /* ABRIR MENU */

        menuBotao.addEventListener(
            "click",
            function(evento) {

                evento.stopPropagation();


                const menusAbertos =
                    document.querySelectorAll(
                        ".menuOpcoes"
                    );


                menusAbertos.forEach(
                    function(outroMenu) {

                        if (
                            outroMenu !== menu
                        ) {

                            outroMenu.style.display =
                                "none";

                        }

                    }
                );


                menu.style.display =
                    menu.style.display === "none"
                        ? "block"
                        : "none";

            }
        );


        menuAcoes.appendChild(
            menuBotao
        );

        menuAcoes.appendChild(
            menu
        );


        areaDireita.appendChild(
            menuAcoes
        );


        item.appendChild(
            areaEsquerda
        );

        item.appendChild(
            areaDireita
        );


        lista.appendChild(
            item
        );

    });


    atualizarControlesSelecao();

    atualizarProgresso();

}


/* =========================
   ADICIONAR
========================= */

function adicionarEstudo() {

    const nome =
        input.value.trim();


    if (nome === "") {

        alert(
            "Digite um assunto para adicionar."
        );

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


/* =========================
   CONCLUIR
========================= */

function marcarConcluido(indice) {

    estudos[indice].concluido =
        !estudos[indice].concluido;


    salvarEstudos();


    mostrarEstudos();

}


/* =========================
   EDITAR
========================= */

function editarEstudo(indice) {

    const novoNome =
        prompt(
            "Digite o novo nome do assunto:",
            estudos[indice].nome
        );


    if (novoNome === null) {

        return;

    }


    const nomeLimpo =
        novoNome.trim();


    if (nomeLimpo === "") {

        alert(
            "O nome do assunto não pode ficar vazio."
        );

        return;

    }


    estudos[indice].nome =
        nomeLimpo;


    salvarEstudos();


    mostrarEstudos();

}


/* =========================
   EXCLUIR INDIVIDUAL
========================= */

function excluirEstudo(indice) {

    const confirmar =
        confirm(
            'Tem certeza que deseja excluir "' +
            estudos[indice].nome +
            '"?'
        );


    if (!confirmar) {

        return;

    }


    estudos.splice(
        indice,
        1
    );


    selecionados = [];


    salvarEstudos();


    mostrarEstudos();

}


/* =========================
   MODO DE SELEÇÃO
========================= */

function alternarModoSelecao() {

    modoSelecao =
        !modoSelecao;


    selecionados = [];


    mostrarEstudos();

}


/* =========================
   CONTROLES
========================= */

function atualizarControlesSelecao() {

    if (!modoSelecao) {

        modoSelecaoBtn.textContent =
            "Selecionar";

        marcarTodosBtn.style.display =
            "none";

        excluirSelecionadosBtn.style.display =
            "none";

        return;

    }


    modoSelecaoBtn.textContent =
        "Cancelar";


    marcarTodosBtn.style.display =
        "inline-block";


    /* Todos selecionados */

    if (
        estudos.length > 0 &&
        selecionados.length === estudos.length
    ) {

        marcarTodosBtn.textContent =
            "Desmarcar todos";

    } else {

        marcarTodosBtn.textContent =
            "Marcar todos";

    }


    /* Excluir */

    if (
        selecionados.length > 0
    ) {

        excluirSelecionadosBtn.style.display =
            "inline-block";

    } else {

        excluirSelecionadosBtn.style.display =
            "none";

    }

}


/* =========================
   MARCAR TODOS
========================= */

function marcarTodos() {

    if (estudos.length === 0) {

        return;

    }


    const todosSelecionados =
        selecionados.length === estudos.length;


    if (todosSelecionados) {

        selecionados = [];

    } else {

        selecionados =
            estudos.map(
                function(estudo, indice) {

                    return indice;

                }
            );

    }


    mostrarEstudos();

}


/* =========================
   EXCLUIR SELECIONADOS
========================= */

function excluirSelecionados() {

    if (
        selecionados.length === 0
    ) {

        return;

    }


    const confirmar =
        confirm(
            "Tem certeza que deseja excluir " +
            selecionados.length +
            " assunto(s)?"
        );


    if (!confirmar) {

        return;

    }


    estudos =
        estudos.filter(
            function(estudo, indice) {

                return !selecionados.includes(
                    indice
                );

            }
        );


    selecionados = [];


    salvarEstudos();


    mostrarEstudos();

}


/* =========================
   PROGRESSO
========================= */

function atualizarProgresso() {

    if (
        estudos.length === 0
    ) {

        progresso.innerHTML =
            '<div class="circuloProgresso">' +
                '<strong>0%</strong>' +
                '<span>concluído</span>' +
            '</div>';

        return;

    }


    const concluidos =
        estudos.filter(
            function(estudo) {

                return estudo.concluido;

            }
        ).length;


    const porcentagem =
        Math.round(
            (concluidos / estudos.length) * 100
        );


    progresso.innerHTML =
        '<div class="circuloProgresso">' +
            '<strong>' +
                porcentagem +
                '%' +
            '</strong>' +
            '<span>concluído</span>' +
        '</div>';


    if (
        porcentagem === 100
    ) {

        progresso.innerHTML +=
            '<div class="mensagemParabens">' +
                '<span>✓</span>' +
                ' Parabéns! Você concluiu todos os assuntos!' +
            '</div>';

    }

}


/* =========================
   EVENTOS
========================= */

botao.addEventListener(
    "click",
    adicionarEstudo
);


input.addEventListener(
    "keydown",
    function(evento) {

        if (
            evento.key === "Enter"
        ) {

            adicionarEstudo();

        }

    }
);


modoSelecaoBtn.addEventListener(
    "click",
    alternarModoSelecao
);


marcarTodosBtn.addEventListener(
    "click",
    marcarTodos
);


excluirSelecionadosBtn.addEventListener(
    "click",
    excluirSelecionados
);


/* =========================
   INICIAR
========================= */

mostrarEstudos();

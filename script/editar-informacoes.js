// ==========================================
// SPOTY - EDITAR INFORMAÇÕES DO USUÁRIO
// ==========================================

const editarForm = document.getElementById("editarForm");
const nomeEditar = document.getElementById("nomeEditar");
const usuarioEditar = document.getElementById("usuarioEditar");
const emailEditar = document.getElementById("emailEditar");
const telefoneEditar = document.getElementById("telefoneEditar");
const senhaEditar = document.getElementById("senhaEditar");
const toast = document.getElementById("toast");

// Pega o usuário que está conectado agora
const usuarioLogado = JSON.parse(localStorage.getItem("spotyUsuarioLogado") || "null");

// Se ninguém estiver conectado, volta para a tela de login
if (!usuarioLogado) {
  window.location.href = "login.html";
}

// Guarda o e-mail original, para encontrar o usuário certo na lista depois
const emailOriginal = usuarioLogado ? usuarioLogado.email : "";

// ==========================================
// PREENCHER O FORMULÁRIO COM OS DADOS ATUAIS
// ==========================================

if (usuarioLogado) {
  const iniciais = pegarIniciais(usuarioLogado.nome);

  document.getElementById("avatarEditar").textContent = iniciais;
  document.getElementById("nomeAtual").textContent = usuarioLogado.nome;
  document.getElementById("emailAtual").textContent = usuarioLogado.email;

  nomeEditar.value = usuarioLogado.nome;
  usuarioEditar.value = usuarioLogado.usuario || "";
  emailEditar.value = usuarioLogado.email;
  telefoneEditar.value = usuarioLogado.telefone || "";
}

function pegarIniciais(nome) {
  const partes = nome.trim().split(/\s+/);

  if (partes.length === 1) {
    return partes[0].substring(0, 2).toUpperCase();
  }

  const primeiraLetra = partes[0].charAt(0);
  const ultimaLetra = partes[partes.length - 1].charAt(0);

  return (primeiraLetra + ultimaLetra).toUpperCase();
}

// Deixa a primeira letra de cada nome maiúscula
// Ex.: "lucas silva PIRES" -> "Lucas Silva Pires"
function deixarIniciaisMaiusculas(nome) {
  const palavras = nome.trim().split(/\s+/);

  const palavrasFormatadas = palavras.map(function (palavra) {
    const primeiraLetra = palavra.charAt(0).toUpperCase();
    const restante = palavra.slice(1).toLowerCase();
    return primeiraLetra + restante;
  });

  return palavrasFormatadas.join(" ");
}

// ==========================================
// FORMATAR TELEFONE
// ==========================================

if (telefoneEditar) {
  telefoneEditar.addEventListener("input", function () {
    let valor = telefoneEditar.value.replace(/\D/g, "");

    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }

    if (valor.length > 10) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d+)/, "($1) $2");
    } else if (valor.length > 0) {
      valor = valor.replace(/(\d+)/, "($1");
    }

    telefoneEditar.value = valor;
  });
}

// ==========================================
// MOSTRAR OU OCULTAR A SENHA
// ==========================================

function alternarVisibilidadeSenha(idDoCampo, botao) {
  const campo = document.getElementById(idDoCampo);

  if (campo.type === "password") {
    campo.type = "text";
    botao.textContent = "Ocultar";
  } else {
    campo.type = "password";
    botao.textContent = "Mostrar";
  }
}

// ==========================================
// SALVAR ALTERAÇÕES
// ==========================================

if (editarForm) {
  editarForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const novoNomeDigitado = nomeEditar.value.trim();
    const novoUsuario = usuarioEditar.value.trim();
    const novoEmail = emailEditar.value.trim();
    const novoTelefone = telefoneEditar.value.trim();
    const novaSenha = senhaEditar.value;

    if (novoNomeDigitado === "") {
      mostrarToast("Digite seu nome completo.");
      return;
    }

    if (novoUsuario === "") {
      mostrarToast("Digite seu nome de usuário.");
      return;
    }

    if (novoEmail === "") {
      mostrarToast("Digite seu e-mail.");
      return;
    }

    if (novoTelefone === "") {
      mostrarToast("Digite seu telefone.");
      return;
    }

    if (novaSenha !== "" && novaSenha.length < 6) {
      mostrarToast("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Deixa o nome com a primeira letra de cada palavra maiúscula
    const novoNome = deixarIniciaisMaiusculas(novoNomeDigitado);

    // Busca todos os usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem("spotyUsuarios") || "[]");

    // Se o e-mail ou o usuário foram trocados, verifica se já pertencem a outra conta
    for (let i = 0; i < usuarios.length; i++) {
      const eOutraConta = usuarios[i].email.toLowerCase() !== emailOriginal.toLowerCase();
      const mesmoEmailNovo = usuarios[i].email.toLowerCase() === novoEmail.toLowerCase();
      const mesmoUsuarioNovo = (usuarios[i].usuario || "").toLowerCase() === novoUsuario.toLowerCase();

      if (eOutraConta && mesmoEmailNovo) {
        mostrarToast("Esse e-mail já está sendo usado por outra conta.");
        return;
      }

      if (eOutraConta && mesmoUsuarioNovo) {
        mostrarToast("Esse nome de usuário já está sendo usado por outra conta.");
        return;
      }
    }

    // Encontra o usuário certo na lista (pelo e-mail antigo) e atualiza os dados
    let usuarioAtualizado = null;

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email.toLowerCase() === emailOriginal.toLowerCase()) {
        usuarios[i].nome = novoNome;
        usuarios[i].usuario = novoUsuario;
        usuarios[i].email = novoEmail;
        usuarios[i].telefone = novoTelefone;

        if (novaSenha !== "") {
          usuarios[i].senha = novaSenha;
        }

        usuarioAtualizado = usuarios[i];
      }
    }

    // Salva a lista de usuários e a sessão atualizada
    localStorage.setItem("spotyUsuarios", JSON.stringify(usuarios));
    localStorage.setItem("spotyUsuarioLogado", JSON.stringify(usuarioAtualizado));

    mostrarToast("Informações atualizadas com sucesso!");

    setTimeout(function () {
      window.location.href = "index.html";
    }, 1200);
  });
}

// ==========================================
// MENSAGEM (TOAST)
// ==========================================

function mostrarToast(mensagem) {
  if (!toast) {
    alert(mensagem);
    return;
  }

  toast.textContent = mensagem;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

// ==========================================
// TRANSIÇÃO ENTRE PÁGINAS
// ==========================================

const pageTransition = document.querySelector(".page-transition");

function transicaoPagina(event, destino) {
  event.preventDefault();

  if (!pageTransition) {
    window.location.href = destino;
    return;
  }

  pageTransition.classList.add("active");

  setTimeout(function () {
    window.location.href = destino;
  }, 420);
}

window.addEventListener("pageshow", function () {
  if (pageTransition) {
    requestAnimationFrame(function () {
      pageTransition.classList.remove("active");
    });
  }
});

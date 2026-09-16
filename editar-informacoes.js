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
// CARREGA OS DADOS DO USUÁRIO LOGADO
// ==========================================

async function carregarUsuarioLogado() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  // Se ninguém estiver conectado, volta para a tela de login
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const { data: perfil, error } = await supabaseClient
    .from("profiles")
    .select("nome, usuario, telefone")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error || !perfil) {
    mostrarToast("Não foi possível carregar seus dados.");
    return;
  }

  const iniciais = pegarIniciais(perfil.nome);

  document.getElementById("avatarEditar").textContent = iniciais;
  document.getElementById("nomeAtual").textContent = perfil.nome;
  document.getElementById("emailAtual").textContent = session.user.email;

  nomeEditar.value = perfil.nome;
  usuarioEditar.value = perfil.usuario || "";
  emailEditar.value = session.user.email;
  telefoneEditar.value = perfil.telefone || "";
}

carregarUsuarioLogado();

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
  editarForm.addEventListener("submit", async function (event) {
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

    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      window.location.href = "login.html";
      return;
    }

    const botaoSalvar = editarForm.querySelector("button[type='submit']");
    if (botaoSalvar) botaoSalvar.disabled = true;

    // 1) Atualiza nome, usuário e telefone na tabela profiles
    const { error: erroPerfil } = await supabaseClient
      .from("profiles")
      .update({
        nome: novoNome,
        usuario: novoUsuario,
        telefone: novoTelefone
      })
      .eq("id", session.user.id);

    if (erroPerfil) {
      if (erroPerfil.message.includes("duplicate") || erroPerfil.code === "23505") {
        mostrarToast("Esse nome de usuário já está sendo usado por outra conta.");
      } else {
        mostrarToast("Não foi possível salvar seus dados.");
      }
      if (botaoSalvar) botaoSalvar.disabled = false;
      return;
    }

    // 2) Se o e-mail ou a senha mudaram, atualiza no Supabase Auth
    const dadosAuthParaAtualizar = {};

    if (novoEmail.toLowerCase() !== session.user.email.toLowerCase()) {
      dadosAuthParaAtualizar.email = novoEmail;
    }

    if (novaSenha !== "") {
      dadosAuthParaAtualizar.password = novaSenha;
    }

    if (Object.keys(dadosAuthParaAtualizar).length > 0) {
      const { error: erroAuth } = await supabaseClient.auth.updateUser(dadosAuthParaAtualizar);

      if (erroAuth) {
        if (erroAuth.message.includes("already registered")) {
          mostrarToast("Esse e-mail já está sendo usado por outra conta.");
        } else {
          mostrarToast("Dados salvos, mas houve um erro ao atualizar e-mail/senha.");
        }
        if (botaoSalvar) botaoSalvar.disabled = false;
        return;
      }

      if (dadosAuthParaAtualizar.email) {
        mostrarToast("Informações atualizadas! Confira seu novo e-mail para confirmar a troca.");
      } else {
        mostrarToast("Informações atualizadas com sucesso!");
      }
    } else {
      mostrarToast("Informações atualizadas com sucesso!");
    }

    setTimeout(function () {
      window.location.href = "../index.html";
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

// ==========================================
// SPOTY - TELA DE LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");
const identificadorLogin = document.getElementById("identificadorLogin");
const senhaLogin = document.getElementById("senhaLogin");
const toast = document.getElementById("toast");

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
// ENTRAR
// ==========================================

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const identificador = identificadorLogin.value.trim();
    const senha = senhaLogin.value;

    if (identificador === "") {
      mostrarToast("Digite seu e-mail ou usuário.");
      return;
    }

    if (senha === "") {
      mostrarToast("Digite sua senha.");
      return;
    }

    // Busca a lista de usuários cadastrados no navegador
    const usuarios = JSON.parse(localStorage.getItem("spotyUsuarios") || "[]");

    // Procura um usuário cujo e-mail OU nome de usuário bate com o que foi digitado
    let usuarioEncontrado = null;

    for (let i = 0; i < usuarios.length; i++) {
      const emailIgual = usuarios[i].email.toLowerCase() === identificador.toLowerCase();
      const usuarioIgual = (usuarios[i].usuario || "").toLowerCase() === identificador.toLowerCase();
      const senhaIgual = usuarios[i].senha === senha;

      if ((emailIgual || usuarioIgual) && senhaIgual) {
        usuarioEncontrado = usuarios[i];
      }
    }

    if (!usuarioEncontrado) {
      mostrarToast("E-mail, usuário ou senha incorretos.");
      return;
    }

    // Guarda quem está conectado agora
    localStorage.setItem("spotyUsuarioLogado", JSON.stringify(usuarioEncontrado));

    mostrarToast("Login realizado! Entrando...");

    // Volta para a tela inicial, agora logado
    setTimeout(function () {
      window.location.href = "index.html";
    }, 900);
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

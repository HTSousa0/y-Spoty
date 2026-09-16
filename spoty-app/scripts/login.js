// ==========================================
// SPOTY - TELA DE LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");
const emailLogin = document.getElementById("identificadorLogin");
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
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailLogin.value.trim();
    const senha = senhaLogin.value;

    if (email === "") {
      mostrarToast("Digite seu e-mail.");
      return;
    }

    if (senha === "") {
      mostrarToast("Digite sua senha.");
      return;
    }

    const botaoEntrar = loginForm.querySelector(".cadastro-btn");
    if (botaoEntrar) botaoEntrar.disabled = true;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: senha
    });

    if (error) {
      mostrarToast("E-mail ou senha incorretos.");
      if (botaoEntrar) botaoEntrar.disabled = false;
      return;
    }

    mostrarToast("Login realizado! Entrando...");

    // Volta para a tela inicial, agora logado
    setTimeout(function () {
      window.location.href = "../index.html";
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

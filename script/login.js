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
  loginForm.addEventListener("submit", async function (event) {
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

    const botaoEntrar = loginForm.querySelector(".cadastro-btn");
    if (botaoEntrar) botaoEntrar.disabled = true;

    // O Supabase Auth só faz login por e-mail. Se a pessoa digitou
    // um "nome de usuário" em vez de e-mail, primeiro descobrimos
    // qual e-mail está ligado a esse usuário na tabela profiles.
    let emailParaLogin = identificador;

    const pareceEmail = identificador.includes("@");

    if (!pareceEmail) {
      const { data: perfilEncontrado, error: erroBusca } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("usuario", identificador)
        .maybeSingle();

      if (erroBusca || !perfilEncontrado) {
        mostrarToast("E-mail, usuário ou senha incorretos.");
        if (botaoEntrar) botaoEntrar.disabled = false;
        return;
      }

      // A tabela profiles não guarda e-mail (ele fica só no Auth),
      // então pedimos pro Supabase confirmar login usando o ID.
      // Como o método de login exige e-mail, o jeito mais simples
      // aqui é pedir para o usuário usar o e-mail no campo de login.
      mostrarToast("Por enquanto, entre usando seu e-mail cadastrado.");
      if (botaoEntrar) botaoEntrar.disabled = false;
      return;
    }

    // Faz login de fato
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: emailParaLogin,
      password: senha
    });

    if (error) {
      mostrarToast("E-mail, usuário ou senha incorretos.");
      if (botaoEntrar) botaoEntrar.disabled = false;
      return;
    }

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

// ==========================================
// SPOTY - TELA DE USUÁRIO CONECTADO
// ==========================================

const toast = document.getElementById("toast");

// Pega as iniciais do nome para usar como "foto" do usuário
// Ex.: "Lucas Silva" -> "LS" | "Lucas" -> "LU"
function pegarIniciais(nome) {
  const partes = nome.trim().split(/\s+/);

  if (partes.length === 1) {
    return partes[0].substring(0, 2).toUpperCase();
  }

  const primeiraLetra = partes[0].charAt(0);
  const ultimaLetra = partes[partes.length - 1].charAt(0);

  return (primeiraLetra + ultimaLetra).toUpperCase();
}

// ==========================================
// CARREGA O USUÁRIO LOGADO E MOSTRA OS DADOS
// ==========================================

async function carregarUsuarioConectado() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  // Se ninguém estiver conectado, volta para a tela de login
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const { data: perfil } = await supabaseClient
    .from("profiles")
    .select("nome")
    .eq("id", session.user.id)
    .maybeSingle();

  const nome = perfil ? perfil.nome : session.user.email;
  const primeiroNome = nome.split(" ")[0];
  const iniciais = pegarIniciais(nome);

  document.getElementById("nomeUsuario").textContent = primeiroNome;
  document.getElementById("dadoNome").textContent = nome;
  document.getElementById("dadoEmail").textContent = session.user.email;

  document.getElementById("avatarBotao").textContent = iniciais;
  document.getElementById("avatarGrande").textContent = iniciais;
  document.getElementById("dropdownNome").textContent = nome;
  document.getElementById("dropdownEmail").textContent = session.user.email;
}

carregarUsuarioConectado();

// ==========================================
// ABRIR / FECHAR O MENU DO USUÁRIO
// ==========================================

function alternarMenuUsuario() {
  document.getElementById("userDropdown").classList.toggle("aberto");
}

// Fecha o menu se o usuário clicar em qualquer lugar fora dele
document.addEventListener("click", function (event) {
  const menu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("userDropdown");

  if (menu && dropdown && !menu.contains(event.target)) {
    dropdown.classList.remove("aberto");
  }
});

// ==========================================
// SAIR (LOGOUT)
// ==========================================

async function sair() {
  await supabaseClient.auth.signOut();

  mostrarToast("Você saiu da sua conta.");

  // Volta para a tela de login
  setTimeout(function () {
    window.location.href = "login.html";
  }, 900);
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

// ==========================================
// SPOTY - SESSÃO DO USUÁRIO (cabeçalho)
// ==========================================
// Esse arquivo decide o que aparece no cabeçalho:
// - Ninguém logado -> mostra os botões "Criar cadastro" e "Entrar".
// - Alguém logado  -> mostra o círculo com as iniciais e o menu do usuário.

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

// Olha se existe alguém logado e troca o que aparece no cabeçalho
function verificarSessao() {
  const areaDeslogado = document.getElementById("headerActionsDeslogado");
  const areaLogado = document.getElementById("userMenuLogado");

  // Se a página não tiver esse cabeçalho, não faz nada
  if (!areaDeslogado || !areaLogado) {
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("spotyUsuarioLogado") || "null");

  if (usuarioLogado) {
    areaDeslogado.style.display = "none";
    areaLogado.style.display = "block";

    const iniciais = pegarIniciais(usuarioLogado.nome);

    document.getElementById("avatarBotao").textContent = iniciais;
    document.getElementById("avatarGrande").textContent = iniciais;
    document.getElementById("dropdownNome").textContent = usuarioLogado.nome;
    document.getElementById("dropdownEmail").textContent = usuarioLogado.email;
  } else {
    areaDeslogado.style.display = "flex";
    areaLogado.style.display = "none";
  }
}

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

function sair() {
  localStorage.removeItem("spotyUsuarioLogado");

  mostrarToast("Você saiu da sua conta.");

  // Atualiza o cabeçalho na hora (sem precisar recarregar a página)
  verificarSessao();
}

verificarSessao();

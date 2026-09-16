// ==========================================
// SPOTY - SCRIPT PRINCIPAL
// ==========================================

// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");

// ==========================================
// ROLAR ATÉ A ÁREA DE BUSCA
// ==========================================

function scrollToSearch() {
  const vagasSection = document.getElementById("vagas");

  if (vagasSection) {
    vagasSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  // Coloca o cursor no campo de pesquisa
  if (searchInput) {
    setTimeout(() => {
      searchInput.focus();
    }, 500);
  }
}

// ==========================================
// BUSCAR VAGAS
// ==========================================

function buscarVagas() {
  // Verifica se o campo existe
  if (!searchInput) {
    console.error("Campo de busca não encontrado.");
    return;
  }

  const endereco = searchInput.value.trim();

  // Verifica se o usuário digitou alguma coisa
  if (endereco === "") {
    mostrarToast("Digite um endereço ou região para buscar.");
    searchInput.focus();
    return;
  }

  mostrarToast(`Buscando vagas próximas de ${endereco}...`);

  // Busca as coordenadas do endereço digitado e atualiza o mapa real
  buscarCoordenadasEAtualizarMapa(endereco);
}

// ==========================================
// USAR LOCALIZAÇÃO
// ==========================================

function usarLocalizacao() {
  // Verifica se o navegador suporta geolocalização
  if (!navigator.geolocation) {
    mostrarToast("Seu navegador não suporta geolocalização.");
    return;
  }

  mostrarToast("Obtendo sua localização...");

  // Solicita localização
  navigator.geolocation.getCurrentPosition(

    // Localização encontrada
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Recentraliza o mapa real na localização do usuário
      centralizarMapa(latitude, longitude, true, "Você está aqui");

      mostrarToast("Localização encontrada!");
    },

    // Erro de localização
    function (error) {
      console.error("Erro ao obter localização:", error);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          mostrarToast("Permissão de localização negada.");
          break;

        case error.POSITION_UNAVAILABLE:
          mostrarToast("Não foi possível obter sua localização.");
          break;

        case error.TIMEOUT:
          mostrarToast("Tempo limite para obter localização.");
          break;

        default:
          mostrarToast("Erro ao obter sua localização.");
          break;
      }
    },

    // Configurações da localização
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// ==========================================
// MAPA REAL (Leaflet + OpenStreetMap)
// ==========================================

let mapaSpoty = null;
let marcadorUsuario = null;

// Centro padrão usado enquanto a localização real não é obtida
const CENTRO_PADRAO = { lat: -23.5505, lng: -46.6333 }; // São Paulo, SP

// Limites aproximados do território brasileiro (o mapa não sai dessa área)
const LIMITES_BRASIL = L.latLngBounds(
  L.latLng(-34.0, -74.5), // sudoeste
  L.latLng(5.5, -32.0)    // nordeste
);

// Garante que a coordenada usada fique dentro do Brasil; senão, usa o centro padrão
function garantirCoordenadaNoBrasil(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) {
    return CENTRO_PADRAO;
  }

  if (!LIMITES_BRASIL.contains([lat, lng])) {
    return CENTRO_PADRAO;
  }

  return { lat, lng };
}

// Corrige o tamanho do mapa depois que o card já tem suas dimensões finais
// (evita o bug do Leaflet "vazar" da área quando o container muda de tamanho)
function corrigirTamanhoDoMapa() {
  if (!mapaSpoty) {
    return;
  }
  mapaSpoty.invalidateSize();
}

// Cria o mapa real, restrito ao território brasileiro
function iniciarMapaReal(lat, lng) {
  const mapaEl = document.getElementById("mapaReal");

  if (!mapaEl || typeof L === "undefined") {
    return;
  }

  const coordenada = garantirCoordenadaNoBrasil(lat, lng);

  mapaSpoty = L.map("mapaReal", {
    zoomControl: false,
    maxBounds: LIMITES_BRASIL,
    maxBoundsViscosity: 1.0,
    minZoom: 4,
    worldCopyJump: false
  }).setView([coordenada.lat, coordenada.lng], 15);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    noWrap: true,
    subdomains: "abcd",
    attribution: "© OpenStreetMap © CARTO"
  }).addTo(mapaSpoty);

  centralizarMapa(coordenada.lat, coordenada.lng, false, "São Paulo (local padrão)");

  // Corrige eventuais problemas de dimensão logo após a criação
  setTimeout(corrigirTamanhoDoMapa, 250);
  setTimeout(corrigirTamanhoDoMapa, 800);
  window.addEventListener("load", corrigirTamanhoDoMapa);
  window.addEventListener("resize", corrigirTamanhoDoMapa);
  window.addEventListener("pageshow", corrigirTamanhoDoMapa);
}

// Move o mapa para uma coordenada exata (sempre dentro do Brasil) e marca o ponto preciso
function centralizarMapa(lat, lng, comAnimacao, textoPopup) {
  const coordenada = garantirCoordenadaNoBrasil(lat, lng);

  if (!mapaSpoty) {
    iniciarMapaReal(coordenada.lat, coordenada.lng);
    return;
  }

  mapaSpoty.setView([coordenada.lat, coordenada.lng], 17, { animate: comAnimacao });
  corrigirTamanhoDoMapa();

  // Remove o marcador anterior
  if (marcadorUsuario) {
    mapaSpoty.removeLayer(marcadorUsuario);
  }

  // Ponto exato na coordenada (círculo fixo, não um pino que "aponta" pra um lugar aproximado)
  marcadorUsuario = L.circleMarker([coordenada.lat, coordenada.lng], {
    radius: 8,
    color: "#fff",
    weight: 3,
    fillColor: "var(--blue-500)",
    fillOpacity: 1
  })
    .addTo(mapaSpoty)
    .bindPopup(textoPopup || "Local buscado");
}

// Converte um endereço digitado em coordenadas reais (Nominatim/OpenStreetMap)
function buscarCoordenadasEAtualizarMapa(endereco) {
  const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=" + encodeURIComponent(endereco);

  fetch(url)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      if (!dados || dados.length === 0) {
        mostrarToast("Não encontramos esse endereço. Tente ser mais específico.");
        return;
      }

      const lat = parseFloat(dados[0].lat);
      const lng = parseFloat(dados[0].lon);
      centralizarMapa(lat, lng, true, endereco);

      mostrarToast(`Mapa centralizado em ${endereco}.`);
    })
    .catch(function (erro) {
      console.error("Erro ao buscar endereço:", erro);
      mostrarToast("Não foi possível buscar esse endereço agora.");
    });
}

// Ao carregar a página, tenta centralizar o mapa na localização real do usuário
// Ao carregar a página, o mapa abre no local padrão (São Paulo).
// A localização real só é pedida quando o usuário clica em
// "Usar minha localização" (função usarLocalizacao, mais acima).
function iniciarLocalizacaoDoMapa() {
  const mapaEl = document.getElementById("mapaReal");

  if (!mapaEl || typeof L === "undefined") {
    return;
  }

  iniciarMapaReal(CENTRO_PADRAO.lat, CENTRO_PADRAO.lng);
}

iniciarLocalizacaoDoMapa();

// ==========================================
// SISTEMA DE TOAST
// ==========================================

function mostrarToast(mensagem) {
  // Se o elemento toast não existir, usa alert como alternativa
  if (!toast) {
    alert(mensagem);
    return;
  }

  // Define o texto
  toast.textContent = mensagem;

  // Adiciona a classe "show"
  toast.classList.add("show");

  // Remove depois de 3 segundos
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ==========================================
// BUSCAR AO PRESSIONAR ENTER
// ==========================================

if (searchInput) {
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      buscarVagas();
    }
  });
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

// Remove a cortina assim que a página estiver visível
// (inclui volta pelo botão do navegador, que não dispara DOMContentLoaded)
window.addEventListener("pageshow", function () {
  if (pageTransition) {
    requestAnimationFrame(function () {
      pageTransition.classList.remove("active");
    });
  }
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// ==========================================
// ROLAGEM SUAVE AO ABRIR COM UMA ÂNCORA
// ==========================================
// Quando o link "Buscar vagas / Depoimentos / Como funciona" é clicado
// em OUTRA página (ex.: cadastro.html), o navegador abre o index.html
// e pula direto para a seção, sem animação. Esta função corrige isso:
// a página começa no topo e rola suavemente até a seção certa.

function rolarParaAncoraInicial() {
  if (!window.location.hash) {
    return;
  }

  const secaoAlvo = document.querySelector(window.location.hash);

  if (!secaoAlvo) {
    return;
  }

  // Começa do topo (desfaz o "pulo" instantâneo do navegador)
  window.scrollTo(0, 0);

  // Espera a cortina de transição entre páginas sumir antes de rolar
  setTimeout(function () {
    secaoAlvo.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 450);
}

window.addEventListener("load", rolarParaAncoraInicial);

console.log("Spoty carregado com sucesso!");

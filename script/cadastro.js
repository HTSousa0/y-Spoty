const cadastroForm = document.getElementById("cadastroForm");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");
const telefoneInput = document.getElementById("telefone");
const toast = document.getElementById("toast");

// Mostrar ou ocultar senha
function mostrarSenha() {
  const botao = document.querySelector(".toggle-password");

  if (senhaInput.type === "password") {
    senhaInput.type = "text";
    botao.textContent = "Ocultar";
  } else {
    senhaInput.type = "password";
    botao.textContent = "Mostrar";
  }
}

// Formatar telefone
if (telefoneInput) {
  telefoneInput.addEventListener("input", function () {
    let valor = telefoneInput.value.replace(/\D/g, "");

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

    telefoneInput.value = valor;
  });
}

// Enviar cadastro
if (cadastroForm) {
  cadastroForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = senhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    // Validações
    if (nome === "") {
      mostrarToast("Digite seu nome completo.");
      return;
    }

    if (email === "") {
      mostrarToast("Digite seu e-mail.");
      return;
    }

    if (senha.length < 6) {
      mostrarToast("Sua senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      mostrarToast("As senhas não são iguais.");
      confirmarSenhaInput.focus();
      return;
    }

    // Cadastro simulado
    console.log("Cadastro realizado!");
    console.log("Nome:", nome);
    console.log("E-mail:", email);

    mostrarToast(`Conta criada com sucesso! Bem-vindo ao Spoty, ${nome}!`);

    cadastroForm.reset();
  });
}

// Mostrar mensagem
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

// Remove a cortina assim que a página estiver visível
// (inclui volta pelo botão do navegador, que não dispara DOMContentLoaded)
window.addEventListener("pageshow", function () {
  if (pageTransition) {
    requestAnimationFrame(function () {
      pageTransition.classList.remove("active");
    });
  }
});

const cadastroForm = document.getElementById("cadastroForm");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");
const telefoneInput = document.getElementById("telefone");
const toast = document.getElementById("toast");

// Mostrar ou ocultar uma senha (usada no campo "senha" e no "confirmarSenha")
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

    const nomeDigitado = document.getElementById("nome").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = telefoneInput.value.trim();
    const senha = senhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    // Validações
    if (nomeDigitado === "") {
      mostrarToast("Digite seu nome completo.");
      return;
    }

    if (usuario === "") {
      mostrarToast("Escolha um nome de usuário.");
      return;
    }

    if (email === "") {
      mostrarToast("Digite seu e-mail.");
      return;
    }

    if (telefone === "") {
      mostrarToast("Digite seu telefone.");
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

    // Deixa o nome com a primeira letra de cada palavra maiúscula
    const nome = deixarIniciaisMaiusculas(nomeDigitado);

    // Busca os usuários já cadastrados no navegador
    const usuarios = JSON.parse(localStorage.getItem("spotyUsuarios") || "[]");

    // Verifica se esse e-mail ou esse nome de usuário já foram cadastrados antes
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email.toLowerCase() === email.toLowerCase()) {
        mostrarToast("Esse e-mail já possui uma conta. Faça login.");
        return;
      }

      if ((usuarios[i].usuario || "").toLowerCase() === usuario.toLowerCase()) {
        mostrarToast("Esse nome de usuário já está em uso.");
        return;
      }
    }

    // Adiciona o novo usuário à lista e salva no navegador
    usuarios.push({
      nome: nome,
      usuario: usuario,
      email: email,
      telefone: telefone,
      senha: senha
    });
    localStorage.setItem("spotyUsuarios", JSON.stringify(usuarios));

    mostrarToast(`Conta criada com sucesso! Agora faça login, ${nome}.`);

    cadastroForm.reset();

    // Depois do cadastro, leva o usuário para a tela de login
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1400);
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

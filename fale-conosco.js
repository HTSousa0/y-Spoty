const contatoForm = document.getElementById("contatoForm");
const toast = document.getElementById("toast");

if (contatoForm) {
  contatoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nomeContato").value.trim();
    const email = document.getElementById("emailContato").value.trim();
    const mensagem = document.getElementById("mensagemContato").value.trim();

    if (nome === "") {
      mostrarToast("Digite seu nome completo.");
      return;
    }

    if (email === "") {
      mostrarToast("Digite seu e-mail.");
      return;
    }

    if (mensagem === "") {
      mostrarToast("Escreva uma mensagem antes de enviar.");
      return;
    }

    // Envio simulado
    console.log("Mensagem de contato enviada!");
    console.log("Nome:", nome);
    console.log("E-mail:", email);
    console.log("Mensagem:", mensagem);

    mostrarToast(`Mensagem enviada! Em breve entraremos em contato, ${nome}.`);

    contatoForm.reset();
  });
}

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

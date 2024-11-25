// acessibilidade

// Usar isso
let speechQueue = null;

document.addEventListener('DOMContentLoaded', function() {
  const colorBlindnessSelect = document.getElementById('colorBlindness');
  const sideColorBlindnessSelect = document.getElementById('sideColorBlindness');

  function applyColorBlindnessFilter(selectedFilter) {
    document.body.className = ''; // Remove todas as classes existentes
    if (selectedFilter !== 'normal') {
      document.body.classList.add(selectedFilter); // Adiciona a nova classe
    }

    if (selectedFilter !== 'normal') {
      const msg = new SpeechSynthesisUtterance(`Você selecionou o filtro ${selectedFilter}`);
      msg.onend = function () {
        speechQueue = null;
      };
      speechQueue = msg;
      window.speechSynthesis.speak(msg);
    }
  }

  // Adiciona os event listeners
  colorBlindnessSelect.addEventListener('change', function() {
    applyColorBlindnessFilter(colorBlindnessSelect.value);
  });

  sideColorBlindnessSelect.addEventListener('change', function() {
    applyColorBlindnessFilter(sideColorBlindnessSelect.value);
  });
});

function readTextOnClick(event) {
  if (speechQueue) {
    window.speechSynthesis.cancel();
  }

  let textToRead = event.target.innerText || event.target.getAttribute('aria-label') || event.target.getAttribute('alt');

  const msg = new SpeechSynthesisUtterance(textToRead);

  // Define o que acontece quando a fala termina
  msg.onend = function () {
    speechQueue = null;
  };

  // não pode ser null
  speechQueue = textToRead;

  // Inicia a fala
  window.speechSynthesis.speak(msg);
}

// cursor pointer pra não ler contéudo invisivel
document.querySelectorAll('button, a, select, [aria-label], .valor-item').forEach(element => {
  const style = window.getComputedStyle(element);
  if (style.cursor === 'pointer') {
    element.addEventListener('click', readTextOnClick);
  }
});
// daltonismo e fala

// Usar isso pra parar de falar
let speechQueue = null;

// Um listener pra ficar trocando
document.addEventListener('DOMContentLoaded', function() {
  const colorBlindnessSelect = document.getElementById('colorBlindness');

  colorBlindnessSelect.addEventListener('change', function() {
    const selectedFilter = colorBlindnessSelect.value;
    document.body.className = ''; // Remove todas as classes ou era pra remover
    if (selectedFilter !== 'normal') {
      document.body.classList.add(selectedFilter);
    }

    // 
    if (selectedFilter !== 'normal') {
      const msg = new SpeechSynthesisUtterance(`Você selecionou o filtro ${selectedFilter}`);
      msg.onend = function () {
        speechQueue = null;
      };
      speechQueue = msg;
      window.speechSynthesis.speak(msg);
    }
  });
});

// Função para ler o texto clicado
function readTextOnClick(event) {
  // faz calar a boca
  if (speechQueue) {
    window.speechSynthesis.cancel();
  }

  //ler o aria-label
  
  let textToRead = event.target.innerText || event.target.getAttribute('aria-label') || event.target.getAttribute('alt');

  // Faz um objeto com o texto que tem que ler
  const msg = new SpeechSynthesisUtterance(textToRead);

  // Só para de falar quando for null
  msg.onend = function () {
    speechQueue = null;
  };

  // a fala recebe o texto clicado aria-label
  speechQueue = textToRead;

  // começa a falar
  window.speechSynthesis.speak(msg);
}

document.querySelectorAll('button, a, select, [aria-label], .valor-item').forEach(element => {
  const style = window.getComputedStyle(element);
  if (style.cursor === 'pointer') {
    element.addEventListener('click', readTextOnClick);
  }
});
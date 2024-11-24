// porque eu odeio javascript a thread
// coisa besta pra delizar as imagens

const slidesWrapper = document.querySelector('.slides-wrapper');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

let currentIndex = 0;
let autoSlideCount = 0;
const maxAutoSlides = 3;

function updateSlidePosition() {
    const offset = -currentIndex * 100; 
    slidesWrapper.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlidePosition();
}

function autoSlide() {
    if (autoSlideCount < maxAutoSlides) { // só 3 vezes porque é chato
        nextSlide();
        autoSlideCount++;
    } else {
        clearInterval(autoSlideInterval); 
    }
}

const autoSlideInterval = setInterval(autoSlide, 5000); // 5 segundos porque sim

let startX = 0;
let isDragging = false;
let currentTranslate = 0;


slidesWrapper.addEventListener('mousedown', (e) => { // só conta apartir do clique
    isDragging = true;
    startX = e.clientX;
});

slidesWrapper.addEventListener('mousemove', (e) => { // só apartir do clique e quando move
    if (!isDragging) return; 
    const diff = e.clientX - startX;
    currentTranslate = -currentIndex * 100 + (diff / window.innerWidth) * 100;
    slidesWrapper.style.transform = `translateX(${currentTranslate}%)`;
    // o numero inteiro pode dar erro caso clique e segure pra sempre no ultimo
    // depois ele se corrige porque a posição do mouse e imagem ficam juntas
});

slidesWrapper.addEventListener('mouseup', (e) => { // aqui ele sai do clique
    isDragging = false;
    const diff = e.clientX - startX;
    if (diff > 50) {
        currentIndex = Math.max(currentIndex - 1, 0);
    } else if (diff < -50) {
        currentIndex = Math.min(currentIndex + 1, totalSlides - 1);
    }
    updateSlidePosition();
});

slidesWrapper.addEventListener('mouseleave', () => {
    if (isDragging) {  // nada a ver só pra não dar erro mesmo
        isDragging = false;
        updateSlidePosition();
    }
});

slidesWrapper.addEventListener('dragstart', (event) => {
    event.preventDefault(); // evita de pegar a imagem quando
});

// toque para celular coloquei porque a maioria vai usar
// mesma coisa
slidesWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

slidesWrapper.addEventListener('touchmove', (e) => {
    const diff = e.touches[0].clientX - startX;
    currentTranslate = -currentIndex * 100 + (diff / window.innerWidth) * 100;
    slidesWrapper.style.transform = `translateX(${currentTranslate}%)`;
});

slidesWrapper.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) {
        currentIndex = Math.max(currentIndex - 1, 0);
    } else if (diff < -50) {
        currentIndex = Math.min(currentIndex + 1, totalSlides - 1);
    }
    updateSlidePosition();
});

// daltonismo e fala

// Usar isso
let speechQueue = null;

document.addEventListener('DOMContentLoaded', function() {
  const colorBlindnessSelect = document.getElementById('colorBlindness');

  colorBlindnessSelect.addEventListener('change', function() {
    const selectedFilter = colorBlindnessSelect.value;
    document.body.className = ''; 
    if (selectedFilter !== 'normal') {
      document.body.classList.add(selectedFilter);
    }

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

document.getElementById('visao-icon').addEventListener('click', function() {
  const colorBlindnessSelector = document.querySelector('.color-blindness-selector');
  colorBlindnessSelector.classList.toggle('visible');
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

function readFullSlide(event) {
  // se ta falando ele para
  if (speechQueue) {
    window.speechSynthesis.cancel();
  }

  const slide = event.currentTarget;

  // pega tudo
  let textToRead = slide.getAttribute('aria-label') || '';
  const altText = slide.querySelector('img')?.getAttribute('alt') || '';
  const titleText = slide.querySelector('.titulo')?.innerText || '';
  const descriptionText = slide.querySelector('.texto')?.innerText || '';

  // e leia tudo
  textToRead += ` ${altText}. ${titleText}. ${descriptionText}`;

  const msg = new SpeechSynthesisUtterance(textToRead);

  msg.onend = function () {
    speechQueue = null;
  };

  speechQueue = msg;

  window.speechSynthesis.speak(msg);
}
  
document.querySelectorAll('.slide').forEach(slide => {
  slide.addEventListener('click', readFullSlide);
});

document.querySelectorAll('.lazy-load').forEach((img) => {
  img.onload = function () {
    const spinner = img.previousElementSibling;
    if (spinner) {
      spinner.style.display = 'none'; 
    }
    img.classList.add('loaded');
  };

  img.onerror = function () {
    console.error('Falha ao carregar a imagem:', img.src);
    const spinner = img.previousElementSibling;
    if (spinner) {
      spinner.style.display = 'none'; // vai fica sem nada mesmo
    }
  };
});
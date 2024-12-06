let perguntas = [];
let indexPerguntaAtual = 0;

// Função para carregar perguntas JSON
async function carregaPerguntas() {
  try {
    const resposta = await fetch('perguntas.json');
    if (!resposta.ok) {
      throw new Error('Erro ao carregar perguntas');
    }
    perguntas = await resposta.json();
    if (perguntas.length > 0) {
      mostraPergunta(indexPerguntaAtual);
    } else {
      console.error("Nenhuma pergunta encontrada no arquivo JSON.");
    }
  } catch (error) {
    console.error("Erro ao carregar perguntas:", error);
  }
}

// mostra a pergunta
function mostraPergunta(index) {
  const perguntaElement = document.getElementById("pergunta");
  const perguntaAtual = perguntas[index];

  if (perguntaAtual) {
    // Atualiza a pergunta
    perguntaElement.textContent = perguntaAtual.pergunta || "Pergunta não encontrada.";

    perguntaAtual.alternativas.forEach((alternativa, i) => {
      const alternativaElement = document.getElementById(i.toString());
      const bordaElement = alternativaElement.closest('.borda');

      if (alternativaElement && bordaElement) {
        alternativaElement.textContent = alternativa || "Alternativa não encontrada.";
        alternativaElement.style.display = 'block';
        bordaElement.style.display = 'block';
      }
    });

    for (let i = perguntaAtual.alternativas.length; i < 4; i++) {
      const alternativaElement = document.getElementById(i.toString());
      const bordaElement = alternativaElement.closest('.borda');

      if (alternativaElement && bordaElement) {
        alternativaElement.style.display = 'none';
        bordaElement.style.display = 'none';
      }
    }
  } else {
    console.error("Pergunta inválida no índice:", index);
  }
}

document.getElementById("estatisticas").addEventListener("click", () => {
  const titulo = document.querySelector(".titulo");
  titulo.textContent = "Estatísticas";

  const classesParaOcultar = ["borda", "pergunta", "mascote"];
  classesParaOcultar.forEach((classe) => {
    const elementos = document.querySelectorAll(`.${classe}`);
    elementos.forEach((elemento) => {
      elemento.style.display = "none";
    });
  });

  // mostrar
  const statsArea = document.getElementById("stats");
  const mensagem = document.getElementById("mensagem");
  if (statsArea) {
    mensagem.style.display = "block";
    statsArea.style.display = "block";
  }
});

document.getElementById("voltar").addEventListener("click", () => {
  if (indexPerguntaAtual > 0) {
    indexPerguntaAtual--;
    mostraPergunta(indexPerguntaAtual);
    alternativaSelecionada = null;
    localStorage.setItem("lastQuestionIndex", indexPerguntaAtual);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    alert("Você já está na primeira pergunta.");
  }

  const classesParaOcultar = ["borda", "pergunta", "mascote"];
    classesParaOcultar.forEach((classe) => {
      const elementos = document.querySelectorAll(`.${classe}`);
      elementos.forEach((elemento) => {
        elemento.style.display = "flex";
      });
    });

    // mostrar
    document.getElementById("estatisticas").style.display = "none";
    document.getElementById("proximo").style.display = "block";
    const statsArea = document.getElementById("stats");
    const mensagem = document.getElementById("mensagem");
    if (statsArea) {
      mensagem.style.display = "none";
      statsArea.style.display = "none";
    }
    
});

carregaPerguntas();
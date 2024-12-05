// Variáveis para armazenar as perguntas e o índice atual
let questions = [];
let currentQuestionIndex = 0;

// Função para carregar perguntas do arquivo JSON
async function loadQuestions() {
  try {
    const response = await fetch('perguntas.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar perguntas');
    }
    questions = await response.json();
    if (questions.length > 0) {
      displayQuestion(currentQuestionIndex);
      updateFieldName(currentQuestionIndex);
    } else {
      console.error("Nenhuma pergunta encontrada no arquivo JSON.");
    }
  } catch (error) {
    console.error("Erro ao carregar perguntas:", error);
  }
}

// Função para exibir a pergunta e suas alternativas
function displayQuestion(index) {
  const perguntaElement = document.getElementById("pergunta");
  const currentQuestion = questions[index];

  if (currentQuestion) {
    // Exibe a pergunta
    perguntaElement.querySelector("h1").textContent = currentQuestion.pergunta || "Pergunta não encontrada.";

    // Exibe as alternativas
    currentQuestion.alternativas.forEach((alternativa, i) => {
      const alternativaElement = document.getElementById(i.toString());
      const bordaElement = alternativaElement.closest('.borda');  // Encontra a div com a classe "borda" correspondente à alternativa
      alternativaElement.textContent = alternativa || "Alternativa não encontrada.";
      alternativaElement.style.display = 'block';  // Torna a alternativa visível
      bordaElement.style.display = 'block'; // Torna a div borda visível
    });

    // Se a pergunta tiver menos de 4 alternativas, esconde a quarta alternativa e sua borda
    if (currentQuestion.alternativas.length < 4) {
      const bordaElement = document.getElementById("3").closest('.borda');  // Encontrando a div "borda" do id="3"
      document.getElementById("3").style.display = 'none';  // Esconde a alternativa 4
      bordaElement.style.display = 'none';  // Esconde a div "borda" que envolve a alternativa 4
    } else {
      const bordaElement = document.getElementById("3").closest('.borda');  // Caso tenha 4 alternativas, assegura que a borda fique visível
      bordaElement.style.display = 'block';
    }
  } else {
    console.error("Pergunta inválida no índice:", index);
  }
}

// Função para atualizar o nome do campo no título
function updateFieldName(index) {
  const fieldName = `Pergunta ${index + 1}`;
  document.getElementById("campo").textContent = fieldName;
}

// Configurar os eventos de clique
document.getElementById("voltar").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
    updateFieldName(currentQuestionIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    alert("Você já está na primeira pergunta.");
  }
});


// Chamar a função para carregar perguntas ao iniciar
loadQuestions();
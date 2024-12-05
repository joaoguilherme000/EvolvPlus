import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getFirestore, collection, addDoc, setDoc, doc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

export const firebaseConfig = {
  apiKey: "AIzaSyDrZ6r44Dzr8S4lgp6n2VrEFqTFmgRN7CA",
  authDomain: "evolvplus-3613e.firebaseapp.com",
  projectId: "evolvplus-3613e",
  storageBucket: "evolvplus-3613e.firebasestorage.app",
  messagingSenderId: "249967067119",
  appId: "1:249967067119:web:b9dd15f42ae3546816801a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

window.onload = async () => {
  let userCode = localStorage.getItem("userCode");

  if (!userCode) {
    try {
      const docRef = await addDoc(collection(db, "Pessoas"), {
        som: true,
      });
      
      userCode = docRef.id;
      localStorage.setItem("userCode", userCode);

      console.log("Documento criado com ID: ", userCode);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  }
};

let selectedAlternative = document.querySelector(".alternativa.selected"); 

function checkSelection() {
  return selectedAlternative !== null;
}

document.querySelectorAll('.alternativa').forEach((alternativa, index) => {
  alternativa.addEventListener('click', () => {
    // Remove a classe "selected" de todas as alternativas
    document.querySelectorAll('.alternativa').forEach(item => item.classList.remove('selected'));

    // Marca a alternativa selecionada
    alternativa.classList.add('selected');
    selectedAlternative = { id: index, texto: alternativa.textContent }; // Armazenar o id e texto da alternativa
  });
});

document.getElementById("proximo").addEventListener("click", async () => {
  // Verifica se o usuário escolheu uma alternativa antes de continuar
  if (!checkSelection()) {
    alert("Por favor, selecione uma alternativa antes de continuar.");
    return; // Impede a mudança de pergunta se nenhuma alternativa foi selecionada
  }

  // Enviar dados para o Firestore
  try {
    const userCode = localStorage.getItem("userCode");

    if (!userCode) {
      alert("Erro ao recuperar código do usuário.");
      return;
    }

    // Objeto para enviar ao Firestore
    const resposta = {
      alternativaId: selectedAlternative.id,
      alternativaTexto: selectedAlternative.texto,
      pergunta: questions[currentQuestionIndex],
      timestamp: new Date(), // Timestamp no formato correto
      userCode: userCode
    };

    // Enviar resposta para o Firestore (adaptado para sua configuração de banco de dados)
    await addDoc(collection(db, "respostas"), resposta);
    console.log("Resposta enviada com sucesso");

    // Avançar para a próxima pergunta
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(currentQuestionIndex);
      selectedAlternative = null; // Resetar a resposta selecionada
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Você já está na última pergunta.");
    }
  } catch (e) {
    console.error("Erro ao enviar resposta: ", e);
    alert("Erro ao enviar resposta. Tente novamente.");
  }
});
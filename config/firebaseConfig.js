import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

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
  const lastQuestionIndex = localStorage.getItem("lastQuestionIndex");

  document.querySelectorAll('.alternativa').forEach(item => {
    item.classList.remove('selected', 'certa', 'errada');
  });

  if (lastQuestionIndex !== null) {
    indexPerguntaAtual = parseInt(lastQuestionIndex, 10);
  } else {
    indexPerguntaAtual = 0; // Começa na primeira pergunta se não houver índice salvo
  }

  mostraPergunta(indexPerguntaAtual);

  if (!userCode) {
    try {
      const docRef = await addDoc(collection(db, "Pessoas"), {
        timestamp: new Date(),
      });
      
      userCode = docRef.id;
      localStorage.setItem("userCode", userCode);

      console.log("Documento criado com ID: ", userCode);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  }
};

let alternativaSelecionada = document.querySelector(".alternativa.selected"); 

function checkSelecionada() {
  return alternativaSelecionada !== null;
}

document.querySelectorAll('.alternativa').forEach((alternativa, index) => {
  alternativa.addEventListener('click', () => {
    document.querySelectorAll('.alternativa').forEach(item => item.classList.remove('selected'));

    document.querySelectorAll('.alternativa').forEach(item => {
      item.classList.remove('selected', 'certa', 'errada');
    });
    const perguntaAtual = perguntas[indexPerguntaAtual];
    const respostaCorreta = perguntaAtual.alternativas[perguntaAtual.correta];

    // Adiciona a classe `selected` à alternativa clicada
    alternativa.classList.add('selected');

    // Verifica se a alternativa clicada é a correta
    if (alternativa.textContent.trim() === respostaCorreta) {
      alternativa.classList.add('certa'); // Marca como correta
    } else {
      alternativa.classList.add('errada'); // Marca como errada
    }

    // Armazena a alternativa selecionada
    alternativaSelecionada = { id: index, texto: alternativa.textContent };
  });
});

document.getElementById("proximo").addEventListener("click", async () => {
  if (!checkSelecionada()) {
    alert("Por favor, selecione uma alternativa antes de continuar.");
    return;
  }

  document.querySelectorAll('.alternativa').forEach(item => {
    item.classList.remove('selected', 'certa', 'errada');
  });

  try {
    const userCode = localStorage.getItem("userCode");

    if (!userCode) {
      alert("Erro ao recuperar código do usuário.");
      return;
    }

    const respostasRef = collection(db, "Respostas");
    const q = query(
      respostasRef,
      where("userCode", "==", userCode),
      where("pergunta", "==", perguntas[indexPerguntaAtual])
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      const respostaDocRef = doc(respostasRef, docId);
      await updateDoc(respostaDocRef, {
        alternativaTexto: alternativaSelecionada.texto,
        alternativaId: alternativaSelecionada.id,
      });
      console.log("Resposta atualizada com sucesso");
    } else {
      const resposta = {
        alternativaTexto: alternativaSelecionada.texto,
        alternativaId: alternativaSelecionada.id,
        pergunta: perguntas[indexPerguntaAtual],
        userCode: userCode,
      };

      await addDoc(respostasRef, resposta);
      console.log("Resposta enviada com sucesso");
    }

    localStorage.setItem("lastQuestionIndex", indexPerguntaAtual);

    if (indexPerguntaAtual < perguntas.length - 1) {
      indexPerguntaAtual++; // Avança o índice corretamente

      // Atualiza a pergunta exibida e só depois salva o índice no localStorage
      mostraPergunta(indexPerguntaAtual);
      localStorage.setItem("lastQuestionIndex", indexPerguntaAtual);

      alternativaSelecionada = null; // Reseta a seleção para evitar problemas
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Você respondeu a todas as perguntas!");
    }
  } catch (e) {
    console.error("Erro ao enviar resposta: ", e);
    alert("Erro ao enviar resposta. Tente novamente.");
  }
});
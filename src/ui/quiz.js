import { t, getCurrentLang, setCurrentLang, applyTranslations } from '../lang/translations.js';

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

async function loadQuizData() {
  const response = await fetch('quiz.json', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Unable to load quiz.json (${response.status})`);
  }

  const data = await response.json();
  validateQuizData(data);
  quizData = data;
}

function validateQuizData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('quiz.json must contain at least one question.');
  }

  data.forEach((item, index) => {
    const questionNumber = index + 1;
    const hasQuestion = typeof item.question === 'string' && item.question.trim();
    const hasOptions = Array.isArray(item.options) && item.options.length >= 2;
    const hasValidAnswer =
      Number.isInteger(item.answer) &&
      hasOptions &&
      item.answer >= 0 &&
      item.answer < item.options.length;

    if (!hasQuestion || !hasOptions || !hasValidAnswer) {
      throw new Error(
        `Invalid question ${questionNumber}. Each item needs question, options, and a valid answer index.`
      );
    }
  });
}

function showQuizError(message) {
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const progressText = document.getElementById('quiz-progress');

  questionText.textContent = message;
  optionsContainer.innerHTML = '';
  progressText.textContent = t('quiz_loading');
}

function loadQuestion() {
  const quizBody = document.getElementById('quiz-body');
  const quizResult = document.getElementById('quiz-result');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const progressText = document.getElementById('quiz-progress');

  if (currentQuestionIndex >= quizData.length) {
    // Show results
    quizBody.classList.add('hidden');
    quizResult.classList.remove('hidden');
    document.getElementById('score-display').textContent = score;
    document.getElementById('total-display').textContent = quizData.length;
    progressText.textContent = t('quiz_complete');
    return;
  }

  const q = quizData[currentQuestionIndex];
  const lang = getCurrentLang();
  const questionText_display = (lang === 'th' && q.question_th) ? q.question_th : q.question;
  const options_display = (lang === 'th' && q.options_th) ? q.options_th : q.options;

  questionText.textContent = questionText_display;
  progressText.textContent = `${t('quiz_progress')} ${currentQuestionIndex + 1} ${t('quiz_of')} ${quizData.length}`;
  
  optionsContainer.innerHTML = '';
  options_display.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(index, q.answer, btn);
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, correctIndex, btnElement) {
  // Disable all buttons
  const buttons = document.querySelectorAll('.btn-option');
  buttons.forEach(b => b.disabled = true);

  if (selectedIndex === correctIndex) {
    btnElement.classList.add('correct');
    score++;
  } else {
    btnElement.classList.add('wrong');
    buttons[correctIndex].classList.add('correct');
  }

  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  // ── Language toggle ──────────────────────────────────────────
  const checkbox = document.getElementById('lang-checkbox');
  if (checkbox) {
    const lang = getCurrentLang();
    checkbox.checked = (lang === 'th');
    applyTranslations(lang);

    checkbox.addEventListener('change', () => {
      const newLang = checkbox.checked ? 'th' : 'en';
      setCurrentLang(newLang);
      applyTranslations(newLang);
      document.documentElement.lang = newLang === 'th' ? 'th' : 'en';
      // Reload current question in new language
      if (currentQuestionIndex < quizData.length) {
        loadQuestion();
      } else {
        // Result screen — re-translate static elements only
        const progressText = document.getElementById('quiz-progress');
        if (progressText) progressText.textContent = t('quiz_complete');
      }
    });
  }

  const restartBtn = document.getElementById('btn-restart');
  if (restartBtn) {
    restartBtn.onclick = () => {
      currentQuestionIndex = 0;
      score = 0;
      document.getElementById('quiz-body').classList.remove('hidden');
      document.getElementById('quiz-result').classList.add('hidden');
      loadQuestion();
    };
  }
  
  loadQuizData()
    .then(loadQuestion)
    .catch((error) => {
      console.error(error);
      showQuizError('Quiz data failed to load. Check quiz.json format and run this page from a local server.');
    });
});

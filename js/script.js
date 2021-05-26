import Question from "./Question.js";
import Quiz from "./Quiz.js";

const App = (function () {
  // cache the DOM

  const quizEl = document.querySelector(".jabquestion");
  const quizQuestionEl = document.querySelector(".jabquestion__question");
  const trackerEl = document.querySelector(".jabquestion__tracker");
  const taglineEl = document.querySelector(".jabquestion__tagline");
  const choicesEl = document.querySelector(".jabquiz__choices");
  const progressInnerEl = document.querySelector(".progress__inner");
  const nextButtonEl = document.querySelector(".next");
  const restartButtonEl = document.querySelector(".restart");

  const q1 = new Question(
    "First President of US?",
    ["Barrack", "Osama", "George", "Monkey"],
    2
  );
  const q2 = new Question(
    "When was JavaScript created?",
    ["June 1995", "May 1995", "July 1885", "Sep 1996"],
    1
  );
  const q3 = new Question(
    "What does CSS stand for?",
    [
      "County Sheriff Service",
      "Cascading sexy sheets",
      "Cascading style sheets",
    ],
    2
  );
  const q4 = new Question(
    "The full form of HTML is...",
    ["Hyper Text Markup Language", "Hold The Mic", "ERROR"],
    0
  );
  const q5 = new Question(
    "console.log(typeof []) would return what?",
    ["Array", "null", "array", "Object"],
    3
  );

  const quiz = new Quiz([q1, q2, q3, q4, q5]);

  const listeners = (_) => {
    nextButtonEl.addEventListener("click", function () {
      const selectedRadioElem = document.querySelector(
        'input[name="choice"]:checked'
      );
      if (selectedRadioElem) {
        const key = Number(selectedRadioElem.getAttribute("data-order"));
        quiz.guess(key);
        renderAll();
      }
    });

    restartButtonEl.addEventListener("click", function () {
      // 1. rest the quiz
      quiz.reset();
      // 2. renderAll()
      renderAll();
      // 3. restore the next Btn
      nextButtonEl.style.opacity = 1;
      nextButtonEl.style.visibility = "visible";
      // 4. reset taglineEl
      setValue(taglineEl, `Pick an option below!`);
    });
  };

  const setValue = (elem, value) => {
    elem.innerHTML = value;
  };

  const renderQuestion = (_) => {
    const question = quiz.getCurrentQuestion().question;
    setValue(quizQuestionEl, question);
    // quizQuestionEl.innerHTML = question;
  };

  const renderChoicesElements = (_) => {
    let markup = "";
    const currentChoices = quiz.getCurrentQuestion().choices;
    currentChoices.forEach((elem, index) => {
      markup += `
     <li class="jabquiz__choice">
        <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}" />
        <label for="choice${index}" class="jabquiz__label">
        <i></i>
        <span>${elem}</span>
        </label>
     </li>
      `;
    });

    setValue(choicesEl, markup);
  };

  const renderTracker = (_) => {
    const index = quiz.currentIndex;
    setValue(trackerEl, `${index + 1} of ${quiz.questions.length}`);
  };

  const getPercentage = (num1, num2) => {
    return Math.round((num1 / num2) * 100);
  };

  const launch = (width, maxPrecent) => {
    let loadingBar = setInterval(function () {
      if (width > maxPrecent) {
        clearInterval(loadingBar);
      } else {
        width++;
        progressInnerEl.style.width = `${width}%`;
      }
    }, 5);
  };

  const renderProgress = (_) => {
    // 1. width
    const currentWidth = getPercentage(
      quiz.currentIndex,
      quiz.questions.length
    );
    // 2. launch(0, width)
    launch(0, currentWidth);
  };

  const renderEndScreen = (_) => {
    setValue(quizQuestionEl, `Great Job!`);
    setValue(taglineEl, `Complete!`);
    setValue(
      trackerEl,
      `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`
    );
    nextButtonEl.style.opacity = 0;
    nextButtonEl.style.visibility = "hidden";
    renderProgress();
  };

  const renderAll = (_) => {
    if (quiz.hasEnded()) {
      //   renderEndScreen
      renderEndScreen();
    } else {
      // 1. Render the question
      renderQuestion();

      // 2. Render the choices elems
      renderChoicesElements();

      // 3. Render tracker
      renderTracker();

      // 4. Render Progress
      renderProgress();
    }
  };

  return {
    renderAll: renderAll,
    listeners: listeners,
  };
})();

App.renderAll();
App.listeners();

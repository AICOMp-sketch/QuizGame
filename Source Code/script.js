/* Questions database - categorized by difficulty */
const questions = {
    easy: [
        {
            question: "What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            answer: "Paris"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars"
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            answer: "Pacific Ocean"
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            answer: "Leonardo da Vinci"
        },
        {
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "NaCl", "O2"],
            answer: "H2O"
        }
    ],
    medium: [
        {
            question: "Which country hosted the 2016 Summer Olympics?",
            options: ["China", "Brazil", "Russia", "UK"],
            answer: "Brazil"
        },
        {
            question: "What year was JavaScript first released?",
            options: ["1990", "1995", "2000", "2005"],
            answer: "1995"
        },
        {
            question: "What is the main component of the Sun?",
            options: ["Liquid hydrogen", "Molten iron", "Hot plasma", "Rocky core"],
            answer: "Hot plasma"
        },
        {
            question: "Which element has the atomic number 1?",
            options: ["Oxygen", "Carbon", "Hydrogen", "Nitrogen"],
            answer: "Hydrogen"
        },
        {
            question: "What is the largest organ of the human body?",
            options: ["Brain", "Liver", "Skin", "Lungs"],
            answer: "Skin"
        }
    ],
    hard: [
        {
            question: "Who was the first woman to win a Nobel Prize?",
            options: ["Marie Curie", "Mother Teresa", "Jane Addams", "Dorothy Crowfoot Hodgkin"],
            answer: "Marie Curie"
        },
        {
            question: "What is the smallest prime number greater than 10?",
            options: ["11", "13", "17", "19"],
            answer: "11"
        },
        {
            question: "Which country has the most time zones?",
            options: ["USA", "Russia", "China", "France"],
            answer: "France"
        },
        {
            question: "What is the most abundant gas in Earth's atmosphere?",
            options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"],
            answer: "Nitrogen"
        },
        {
            question: "In computing, what does the acronym 'GUI' stand for?",
            options: ["General User Interface", "Graphical Utility Interface", "Graphical User Interface", "General Utility Interface"],
            answer: "Graphical User Interface"
        }
    ],
    essay: [
        {
            question: "Explain the theory of relativity in simple terms.",
            answer: "A theory explaining gravity's effect on space and time."
        },
        {
            question: "Describe the water cycle and its importance to Earth's ecosystems.",
            answer: "Continuous movement of water between Earth's surface and atmosphere."
        },
        {
            question: "What are the main differences between classical and quantum physics?",
            answer: "Classical physics describes macroscopic world while quantum physics describes atomic and subatomic scales."
        },
        {
            question: "Explain how photosynthesis works in plants.",
            answer: "Process where plants convert light energy into chemical energy."
        },
        {
            question: "Describe the impact of the Industrial Revolution on modern society.",
            answer: "Transition to mechanized manufacturing that transformed economies and societies."
        }
    ]
};

const currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let userAnswers = [];
let questionCount = 10;
let questionType = "multiple";
let quizDifficulty = "easy";

document.getElementById('start-quiz').addEventListener('click', startQuiz);
document.getElementById('next-question').addEventListener('click', nextQuestion);
document.getElementById('previous-question').addEventListener('click', previousQuestion);
document.getElementById('submit-quiz').addEventListener('click', submitQuiz);

function startQuiz() {
    // Get quiz parameters from the setup screen
    questionCount = parseInt(document.getElementById('question-count').value);
    questionType = document.querySelector('input[name="question-type"]:checked').value;
    quizDifficulty = document.getElementById('difficulty').value;

    // Prepare questions
    prepareQuestions();

    // Initialize quiz
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = new Array(questionCount).fill(null);
    
    // Switch to quiz screen
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    
    // Update total questions display
    document.getElementById('total-questions').textContent = `/${questionCount}`;
    
    // Show first question
    showQuestion();
}

function prepareQuestions() {
    const availableQuestions = [...questions[quizDifficulty]];
    
    // Shuffle questions to randomize selection
    shuffleArray(availableQuestions);
    
    // Select the requested number of questions
    currentQuestions.length = 0;
    currentQuestions.push(...availableQuestions.slice(0, questionCount));
}

function showQuestion() {
    // Stop previous timer
    clearInterval(timer);
    
    // Reset timer
    timeLeft = 30;
    document.getElementById('time-left').textContent = timeLeft;
    
    // Start new timer
    timer = setInterval(updateTimer, 1000);
    
    // Update question number display
    document.getElementById('question-number').textContent = `Question ${currentQuestionIndex + 1}`;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / questionCount) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    
    // Show or hide navigation buttons
    document.getElementById('previous-question').disabled = currentQuestionIndex === 0;
                if (currentQuestionIndex === 0) {
                    document.getElementById('previous-question').classList.add('opacity-50');
                    document.getElementById('previous-question').classList.add('cursor-not-allowed');
                } else {
                    document.getElementById('previous-question').classList.remove('opacity-50');
                    document.getElementById('previous-question').classList.remove('cursor-not-allowed');
                }
    
    if (currentQuestionIndex === questionCount - 1) {
        document.getElementById('next-question').classList.add('hidden');
        document.getElementById('submit-quiz').classList.remove('hidden');
    } else {
        document.getElementById('next-question').classList.remove('hidden');
        document.getElementById('submit-quiz').classList.add('hidden');
    }
    
    // Display question
    const currentQuestion = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').textContent = currentQuestion.question;
    
    // Clear previous options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Show options or essay input based on question type
    if (questionType === "multiple") {
        document.getElementById('options-container').classList.remove('hidden');
        document.getElementById('essay-input').classList.add('hidden');
        
        currentQuestion.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = `option p-3 border rounded-md cursor-pointer ${userAnswers[currentQuestionIndex] === option ? 'bg-indigo-100 border-indigo-300' : ''}`;
            optionDiv.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionDiv.dataset.option = option;
            optionDiv.addEventListener('click', () => selectOption(option, optionDiv));
            optionsContainer.appendChild(optionDiv);
        });
    } else {
        document.getElementById('options-container').classList.add('hidden');
        document.getElementById('essay-input').classList.remove('hidden');
        document.getElementById('essay-answer').value = userAnswers[currentQuestionIndex] || '';
    }
}

function selectOption(option, element) {
    // Deselect all options in this question
    const options = document.querySelectorAll('#options-container .option');
    options.forEach(el => {
        el.classList.remove('bg-indigo-100', 'border-indigo-300');
    });
    
    // Select clicked option
    element.classList.add('bg-indigo-100', 'border-indigo-300');
    userAnswers[currentQuestionIndex] = option;
}

function updateTimer() {
    timeLeft--;
    document.getElementById('time-left').textContent = timeLeft;
    
    if (timeLeft <= 5) {
        document.getElementById('timer').classList.add('bg-red-200', 'animate-pulse');
    }
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        nextQuestion();
    }
}

function nextQuestion() {
    // Save essay answer if applicable
    if (questionType === "essay") {
        userAnswers[currentQuestionIndex] = document.getElementById('essay-answer').value;
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questionCount) {
        showQuestion();
    } else {
        submitQuiz();
    }
}

function previousQuestion() {
    // Save essay answer if applicable
    if (questionType === "essay") {
        userAnswers[currentQuestionIndex] = document.getElementById('essay-answer').value;
    }
    
    currentQuestionIndex--;
    showQuestion();
}

function submitQuiz() {
    clearInterval(timer);
    
    // Calculate score for multiple choice
    if (questionType === "multiple") {
        currentQuestions.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                score++;
            }
        });
    }
    
    // For essay questions, we'll just show the results with answers
    if (questionType === "essay") {
        // Don't score essays automatically, just show answers
        score = 0;
    }
    
    // Show results screen
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    
    // Update score display
    const percentage = (score / questionCount) * 100;
    document.getElementById('final-score').textContent = score;
    document.getElementById('total-questions-result').textContent = questionCount;
    
    // Update circular progress
    setTimeout(() => {
        document.getElementById('score-circle').setAttribute('stroke-dasharray', `${percentage}, 100`);
        document.querySelector('#score-circle + text').textContent = `${Math.round(percentage)}%`;
    }, 100);
    
    // Set result message
    const passingScore = 50;
    const resultTitle = percentage >= passingScore ? "Congratulations!" : "Keep Practicing!";
    const resultMessage = percentage >= passingScore 
        ? `You passed with a score of ${Math.round(percentage)}%! Great job!` 
        : `You scored ${Math.round(percentage)}%. Try again to improve your score!`;
    
    document.getElementById('result-title').textContent = `${resultTitle} Score: ${score}/${questionCount}`;
    document.getElementById('result-message').textContent = resultMessage;
    
    // Show correct answers for review
    const answersContainer = document.createElement('div');
    answersContainer.className = 'mt-6 text-left';
    
    currentQuestions.forEach((question, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'mb-4 p-3 border rounded-md';
        
        const questionTitle = document.createElement('div');
        questionTitle.className = 'font-medium text-gray-800';
        questionTitle.textContent = `${index + 1}. ${question.question}`;
        
        const userAnswer = document.createElement('div');
        userAnswer.className = 'text-gray-600 mt-1';
        userAnswer.textContent = `Your answer: ${userAnswers[index] || 'No answer provided'}`;
        
        const correctAnswer = document.createElement('div');
        correctAnswer.className = 'text-green-600 mt-1 font-medium';
        correctAnswer.textContent = `Correct answer: ${question.answer}`;
        
        answerDiv.appendChild(questionTitle);
        answerDiv.appendChild(userAnswer);
        
        if (questionType === "multiple") {
            answerDiv.appendChild(correctAnswer);
            
            // Highlight incorrect answers
            if (userAnswers[index] !== question.answer) {
                correctAnswer.classList.add('text-red-600');
                answerDiv.classList.add('border-red-200', 'bg-red-50');
            }
        }
        
        answersContainer.appendChild(answerDiv);
    });
    
    document.getElementById('results-screen').appendChild(answersContainer);
    
    // Add restart button
    const restartButton = document.createElement('button');
    restartButton.className = 'mt-6 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200';
    restartButton.textContent = 'Start New Quiz';
    restartButton.addEventListener('click', restartQuiz);
    document.getElementById('results-screen').appendChild(restartButton);
}

function restartQuiz() {
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
    
    // Remove dynamically added elements
    const resultsScreen = document.getElementById('results-screen');
    while (resultsScreen.children.length > 4) {
        resultsScreen.removeChild(resultsScreen.lastChild);
    }
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

class BalloonShootGame {
    constructor() {
        this.score = 0;
        this.currentQuestion = 0;
        this.questions = [
            {
                question: "Which language is primarily used for web development?",
                answers: ["Python", "JavaScript", "C++", "Java"],
                correct: 1
            },
            {
                question: "Which HTML tag is used to define a hyperlink?",
                answers: ["<a>", "<link>", "<href>", "<url>"],
                correct: 0
            },
            {
                question: "What does CSS stand for?",
                answers: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"],
                correct: 2
            },
            {
                question: "Which one is a JavaScript framework?",
                answers: ["Django", "React", "Flask", "Laravel"],
                correct: 1
            },
            {
                question: "What symbol is used to denote an ID selector in CSS?",
                answers: [".", "#", "*", "$"],
                correct: 1
            }
        ];
        
        this.gameArea = document.getElementById('game-area');
        this.scoreElement = document.getElementById('score');
        this.questionNumberElement = document.getElementById('question-number');
        this.questionTextElement = document.getElementById('question-text');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        
        this.init();
    }

    init() {
        this.displayQuestion();
        this.createBalloons();
    }

    displayQuestion() {
        if (this.currentQuestion < this.questions.length) {
            const question = this.questions[this.currentQuestion];
            this.questionTextElement.textContent = question.question;
            this.questionNumberElement.textContent = this.currentQuestion + 1;
        }
    }

    createBalloons() {
        this.gameArea.innerHTML = '';
        
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestion];
        const shuffledAnswers = this.shuffleArray([...question.answers]);
        
        shuffledAnswers.forEach((answer, index) => {
            const balloon = this.createBalloon(answer, index);
            this.positionBalloon(balloon);
            this.gameArea.appendChild(balloon);
        });
    }

    createBalloon(answer, index) {
        const balloon = document.createElement('div');
        balloon.className = `balloon color${(index % 4) + 1}`;
        balloon.innerHTML = `
            <div class="balloon-body">${answer}</div>
            <div class="balloon-string"></div>
        `;
        
        balloon.addEventListener('click', () => this.shootBalloon(balloon, answer));
        
        return balloon;
    }

    positionBalloon(balloon) {
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const maxX = gameAreaRect.width - 120;
        const maxY = gameAreaRect.height - 150;
        
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        
        balloon.style.left = x + 'px';
        balloon.style.top = y + 'px';
        
        // Add random animation delay
        balloon.style.animationDelay = Math.random() * 2 + 's';
    }

    shootBalloon(balloon, answer) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = answer === question.answers[question.correct];
        
        balloon.classList.add('popped');
        
        if (isCorrect) {
            this.score++;
            this.scoreElement.textContent = this.score;
            this.showFeedback(balloon, true);
        } else {
            this.showFeedback(balloon, false);
        }

        // Remove event listeners from all balloons
        const allBalloons = this.gameArea.querySelectorAll('.balloon');
        allBalloons.forEach(b => {
            b.style.pointerEvents = 'none';
        });

        setTimeout(() => {
            this.currentQuestion++;
            this.displayQuestion();
            this.createBalloons();
        }, 1500);
    }

    showFeedback(balloon, isCorrect) {
        const feedback = document.createElement('div');
        feedback.style.position = 'absolute';
        feedback.style.left = balloon.style.left;
        feedback.style.top = balloon.style.top;
        feedback.style.fontSize = '24px';
        feedback.style.fontWeight = 'bold';
        feedback.style.zIndex = '1000';
        feedback.style.animation = 'pop 1s ease-out forwards';
        
        if (isCorrect) {
            feedback.textContent = '🎉 +1';
            feedback.style.color = '#7c3aed';
        } else {
            feedback.textContent = '❌ Wrong';
            feedback.style.color = '#dc2626';
        }
        
        this.gameArea.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 1500);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    endGame() {
        this.gameArea.style.display = 'none';
        this.gameOverElement.style.display = 'block';
        this.finalScoreElement.textContent = this.score;
    }
}

function restartGame() {
    location.reload();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BalloonShootGame();
});

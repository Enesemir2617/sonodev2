const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const scoreElement = document.getElementById('score');

// Set canvas size
canvas.width = 300;
canvas.height = 300;

// Game constants
const gridSize = 15;
const tileCount = canvas.width / gridSize;
let score = 0;

// Snake properties
let snake = [
    { x: 5, y: 10 }
];
let dx = 1;
let dy = 0;
let speed = 7;

// Food properties
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

// Game state
let gameRunning = false;
let gameLoop;

// Event listeners
startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', changeDirection);

function startGame() {
    if (gameRunning) return;
    
    // Reset game state
    snake = [{ x: 5, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    
    gameRunning = true;
    startBtn.textContent = 'Restart Game';
    gameLoop = setInterval(update, 1000 / speed);
}

function update() {
    if (!gameRunning) return;

    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    // Check for collisions
    if (isCollision()) {
        gameOver();
        return;
    }

    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * gridSize,
            segment.y * gridSize,
            segment.x * gridSize + gridSize,
            segment.y * gridSize + gridSize
        );
        
        if (index === 0) {
            // Head
            gradient.addColorStop(0, '#2ecc71');
            gradient.addColorStop(1, '#27ae60');
        } else {
            // Body
            gradient.addColorStop(0, '#3498db');
            gradient.addColorStop(1, '#2980b9');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        
        // Add eyes to the head
        if (index === 0) {
            ctx.fillStyle = 'white';
            const eyeSize = 2;
            const eyeOffset = 3;
            ctx.fillRect(
                segment.x * gridSize + eyeOffset,
                segment.y * gridSize + eyeOffset,
                eyeSize,
                eyeSize
            );
            ctx.fillRect(
                segment.x * gridSize + gridSize - eyeOffset - eyeSize,
                segment.y * gridSize + eyeOffset,
                eyeSize,
                eyeSize
            );
        }
    });

    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Add shine to food
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/3,
        food.y * gridSize + gridSize/3,
        gridSize/6,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Make sure food doesn't spawn on snake
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

function isCollision() {
    const head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    startBtn.textContent = 'Start Game';
    alert(`Game Over! Your score: ${score}`);
} 
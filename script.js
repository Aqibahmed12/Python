const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');

const gridSize = 20;
const canvasSize = canvas.width;
const tileSize = canvasSize / gridSize;

let snake;
let food;
let direction;
let score;
let gameInterval;
let gameSpeed = 150; // Milliseconds per frame
let isGameOver;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = score;
    isGameOver = false;
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    startButton.textContent = 'Restart Game';
}

function generateFood() {
    let newFoodPosition;
    while (true) {
        newFoodPosition = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
        let collisionWithSnake = false;
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === newFoodPosition.x && snake[i].y === newFoodPosition.y) {
                collisionWithSnake = true;
                break;
            }
        }
        if (!collisionWithSnake) {
            food = newFoodPosition;
            break;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw food - make it a more appealing 'apple' or 'berry'
    const foodX = food.x * tileSize + tileSize / 2;
    const foodY = food.y * tileSize + tileSize / 2;
    const foodRadius = tileSize / 2 * 0.7; // Smaller for a 'bite-sized' look

    let foodGradient = ctx.createRadialGradient(foodX, foodY, foodRadius * 0.3, foodX, foodY, foodRadius);
    foodGradient.addColorStop(0, '#e74c3c'); // Bright red center
    foodGradient.addColorStop(1, '#c0392b'); // Darker red edge
    foodGradient.addColorStop(1, '#8b0000'); // Even darker red for depth

    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
    ctx.fillStyle = foodGradient;
    ctx.fill();
    ctx.strokeStyle = '#a52a2a'; // Brownish red for outline
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Draw snake - from tail to head to ensure head is on top if overlapping
    for (let i = snake.length - 1; i >= 0; i--) { // Drawing tail first ensures head is on top
        const segment = snake[i];
        const segX = segment.x * tileSize + tileSize / 2;
        const segY = segment.y * tileSize + tileSize / 2;
        const segRadius = tileSize / 2 * 0.9; // Slightly smaller than tile to create separation, or almost full for overlap

        let snakeGradient;
        let snakeStrokeColor;

        if (i === 0) { // Head
            snakeGradient = ctx.createRadialGradient(segX, segY, segRadius * 0.4, segX, segY, segRadius);
            snakeGradient.addColorStop(0, '#32cd32'); // Lime green for head center
            snakeGradient.addColorStop(0.7, '#228b22'); // Forest green for head body
            snakeGradient.addColorStop(1, '#1a6a2c'); // Darkest green for head edge
            snakeStrokeColor = '#1a6a2c';
        } else { // Body
            snakeGradient = ctx.createRadialGradient(segX, segY, segRadius * 0.4, segX, segY, segRadius);
            snakeGradient.addColorStop(0, '#2ecc71'); // Light green for body center
            snakeGradient.addColorStop(0.7, '#27ae60'); // Darker green for body body
            snakeGradient.addColorStop(1, '#1e8449'); // Even darker green for body edge
            snakeStrokeColor = '#1e8449';
        }

        ctx.beginPath();
        ctx.arc(segX, segY, segRadius, 0, Math.PI * 2);
        ctx.fillStyle = snakeGradient;
        ctx.fill();
        ctx.strokeStyle = snakeStrokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
}

function gameLoop() {
    if (isGameOver) {
        return;
    }

    // Move snake
    const head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Check for collision with walls or self
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || checkSelfCollision(head)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    startButton.textContent = 'Play Again';
}

document.addEventListener('keydown', e => {
    if (isGameOver) return;

    const newDirection = e.key.toLowerCase();
    if (newDirection === 'w' || newDirection === 'arrowup') {
        if (direction !== 'down') direction = 'up';
    } else if (newDirection === 's' || newDirection === 'arrowdown') {
        if (direction !== 'up') direction = 'down';
    } else if (newDirection === 'a' || newDirection === 'arrowleft') {
        if (direction !== 'right') direction = 'left';
    } else if (newDirection === 'd' || newDirection === 'arrowright') {
        if (direction !== 'left') direction = 'right';
    }
});

startButton.addEventListener('click', initGame);

// Initial setup, but don't start automatically
// draw(); // Draw initial state if desired before first start

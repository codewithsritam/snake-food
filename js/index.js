const foodMusic = new Audio('../music/food.mp3');
const moveMusic = new Audio('../music/move.mp3');
const startMusic = new Audio('../music/music.mp3');
const gameoverMusic = new Audio('../music/gameover.mp3');
const Board = document.querySelector('.sub-container');
const baseSpeed = 6;
let speed = baseSpeed;
let lastPaintTime = 0;
let score = 0;
let foodEatenCount = 0; // New counter for foods eaten
let headVelocity = { x: 0, y: 0 };
let headArr = [{ x: 12, y: 14 }];
let foodObj = { x: 4, y: 5 };
let isFoodPrince = false; // Flag to indicate if current food is a "food-prince"
let foodPrinceInterval = 5;
const gameOver = document.querySelector('.gameOver');
const Reset = document.getElementById('Reset');

// Main
function main(currentTime) {
    window.requestAnimationFrame(main);
    if ((currentTime - lastPaintTime) / 1000 < 2 / speed) {
        return;
    }
    lastPaintTime = currentTime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < headArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

// Function to toggle the food-prince dynamically
function toogleFoodPrince() {
    isFoodPrince = foodEatenCount % foodPrinceInterval === 0;
}

// Reset all 
Reset.addEventListener('click', () => {
    gameOver.style.transform = 'translate(-100%)';
    scoreBox.innerHTML = "Score: " + 0;
});

function gameEngine() {
    if (isCollide(headArr)) {
        gameoverMusic.play();
        startMusic.pause();
        headVelocity = { x: 0, y: 0 };
        isFoodPrince = false;
        gameOver.style.transform = 'unset';
        headArr = [{ x: 3, y: 5 }];
        score = 0;
        foodEatenCount = 0; // Reset counter
        speed = baseSpeed // Reset speed
    }

    // Check if snake has eaten the current food
    if (headArr[0].y === foodObj.y && headArr[0].x === foodObj.x) {
        foodMusic.play();
        score += isFoodPrince ? 3 : 1;
        foodEatenCount++;
        toogleFoodPrince();

        if(isFoodPrince){
            speed += 1; // Increase speed slightly for each "food-prince"
        }

        if (score > hiscoreVal) {
            hiscoreVal = score;
            localStorage.setItem('hiscore', JSON.stringify(hiscoreVal));
            hiScoreBox.innerHTML = "HiScore : " + hiscoreVal;
        }
        scoreBox.innerHTML = "Score: " + score;
        
        // Increase snake length by 2 if food-prince is eaten
        const growth = isFoodPrince ? 2 : 1;
        for (let i = 0; i < growth; i++) {
            headArr.unshift({ x: headArr[0].x + headVelocity.x, y: headArr[0].y + headVelocity.y });
        }

        // Generate new food position and toggle food-prince every 4th food eaten
        let a = 2;
        let b = 16;
        foodObj = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Move the snake
    for (let i = headArr.length - 2; i >= 0; i--) {
        headArr[i + 1] = { ...headArr[i] };
    }
    headArr[0].x += headVelocity.x;
    headArr[0].y += headVelocity.y;

    // Display the snake
    Board.innerHTML = '';
    headArr.forEach((element, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = element.y;
        snakeElement.style.gridColumnStart = element.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'tall');
        Board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = foodObj.y;
    foodElement.style.gridColumnStart = foodObj.x;
    foodElement.classList.add(isFoodPrince ? 'food-prince' : 'food');
    Board.appendChild(foodElement);
}

// Hi score value
const hiScore = localStorage.getItem('hiscore');
if (hiScore === null) {
    hiscoreVal = 0;
    localStorage.setItem('hiscore', JSON.stringify(hiscoreVal));
} else {
    hiscoreVal = JSON.parse(hiScore);
    hiScoreBox.innerHTML = "HiScore : " + hiScore;
}

// Starts
window.requestAnimationFrame(main);

// Keydown event listener for arrow keys
window.addEventListener('keydown', (e) => {
    startMusic.play();
    moveMusic.play();

    // Check current movement direction and prevent opposite direction input
    switch (e.key) {
        case 'ArrowUp':
            if (headVelocity.y !== 1) { // Prevent moving down if moving up or currently moving horizontally
                headVelocity = { x: 0, y: -1 };
            }
            break;

        case 'ArrowDown':
            if (headVelocity.y !== -1) { // Prevent moving up if moving down or currently moving horizontally
                headVelocity = { x: 0, y: 1 };
            }
            break;

        case 'ArrowLeft':
            if (headVelocity.x !== 1) { // Prevent moving right if moving left or currently moving vertically
                headVelocity = { x: -1, y: 0 };
            }
            break;

        case 'ArrowRight':
            if (headVelocity.x !== -1) { // Prevent moving left if moving right or currently moving vertically
                headVelocity = { x: 1, y: 0 };
            }
            break;

        default:
            break;
    }
});


// Handle touch controls for mobile
document.getElementById('up').addEventListener('click', () => {
    if(headVelocity.y !== 1) {
        headVelocity = { x: 0, y: -1 };
    }
    startMusic.play();
    moveMusic.play();
});

document.getElementById('down').addEventListener('click', () => {
    if(headVelocity.y !== -1) {
        headVelocity = { x: 0, y: 1 };
    }
    startMusic.play();
    moveMusic.play();
});

document.getElementById('left').addEventListener('click', () => {
    if(headVelocity.x !== 1){
        headVelocity = { x: -1, y: 0 };
    }
    startMusic.play();
    moveMusic.play();
});

document.getElementById('right').addEventListener('click', () => {
    if(headVelocity.x !== -1){
        headVelocity = { x: 1, y: 0 };
    }
    startMusic.play();
    moveMusic.play();
});
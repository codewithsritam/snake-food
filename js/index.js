let headVelocity = { x: 0, y: 0 };
const foodMusic = new Audio('../music/food.mp3');
const moveMusic = new Audio('../music/move.mp3');
const startMusic = new Audio('../music/music.mp3');
const gameoverMusic = new Audio('../music/gameover.mp3');
const Board = document.querySelector('.sub-container');
const speed = 6;
let lastPaintTime = 0;
let score = 0;
let headArr = [ { x: 12, y: 14 } ];
let foodObj = { x: 4, y: 5 };


// Main
function main(currentTime) {
    window.requestAnimationFrame(main);
    if((currentTime - lastPaintTime) / 1000 < 2/speed) {
        return;
    }
    lastPaintTime = currentTime
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself
    for (let i = 1; i < headArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // If you bump into the wall
    if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    // Part 1: Update the snake array and food
    if(isCollide(headArr)) {
        gameoverMusic.play();
        startMusic.pause();
        headVelocity = { x: 0, y: 0 };
        alert('Game over. Press any key to play again!');
        headArr = [ { x: 3, y: 5 } ];
        score = 0;
    }

    // If you have eaten the food, increament the score and regenerate the food
    if(headArr[0].y === foodObj.y && headArr[0].x === foodObj.x) {
        foodMusic.play();
        score += 1;
        if (score > hiscoreVal) {
            hiscoreVal = score;
            localStorage.setItem('hiscore', JSON.stringify(hiscoreVal));
            hiScoreBox.innerHTML = "HiScore : " + hiscoreVal;
        }
        scoreBox.innerHTML = "Score: " + score;
        headArr.unshift({ x: headArr[0].x + headVelocity.x, y: headArr[0].y + headVelocity.y });
        let a = 2;
        let b = 16;
        foodObj = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    // Moving the snake
    for (let i = headArr.length - 2; i >= 0; i--) {
        headArr[i+1] = {...headArr[i]};
    }

    headArr[0].x += headVelocity.x;
    headArr[0].y += headVelocity.y;


    // Part: 2
    // Display the snake
    Board.innerHTML = '';
    headArr.forEach((element, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = element.y;
        snakeElement.style.gridColumnStart = element.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }else {
            snakeElement.classList.add('tall');
        }
        Board.appendChild(snakeElement);
    });

    // Display the food
    foodElement =  document.createElement('div');
    foodElement.style.gridRowStart = foodObj.y;
    foodElement.style.gridColumnStart = foodObj.x;
    foodElement.classList.add('food');
    Board.appendChild(foodElement);
}

// Hi score value
const hiScore = localStorage.getItem('hiscore');
if(hiScore === null) {
    hiscoreVal = 0;
    localStorage.setItem('hiscore', JSON.stringify(hiscoreVal));
}
else {
    hiscoreVal = JSON.parse(hiScore);
    hiScoreBox.innerHTML = "HiScore : " + hiScore;
}


// Starts
window.requestAnimationFrame(main);

// key down
window.addEventListener('keydown', e => {
    startMusic.play();
    headVelocity = { x: 0, y: 1 } // start the game
    moveMusic.play();
    switch (e.key) {
        case 'ArrowUp':
            console.log('ArrowUp');
            headVelocity.x = 0;
            headVelocity.y = -1;
            break;

        case 'ArrowDown':
            console.log('ArrowDown');
            headVelocity.x = 0;
            headVelocity.y = 1;
            break;

        case 'ArrowLeft':
            console.log('ArrowLeft');
            headVelocity.x = -1;
            headVelocity.y = 0;
            break;
        
        case 'ArrowRight': 
            console.log('ArrowRight');
            headVelocity.x = 1;
            headVelocity.y = 0;
            break; 

        default:
            break;
    }
});


// Handle touch controls for mobile
document.getElementById('up').addEventListener('click', () => {
    headVelocity = { x: 0, y: -1 };
    startMusic.play();
    moveMusic.play();
});

document.getElementById('down').addEventListener('click', () => {
    headVelocity = { x: 0, y: 1 };
    startMusic.play();
    moveMusic.play();
});

document.getElementById('left').addEventListener('click', () => {
    headVelocity = { x: -1, y: 0 };
    startMusic.play();
    moveMusic.play();
});

document.getElementById('right').addEventListener('click', () => {
    headVelocity = { x: 1, y: 0 };
    startMusic.play();
    moveMusic.play();
});

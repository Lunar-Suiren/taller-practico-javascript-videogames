const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up-b');
const btnLeft = document.querySelector('#left-b');
const btnRight = document.querySelector('#right-b');
const btnDown = document.querySelector('#down-b');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval

const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
};
let enemyPosition = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function fixNumber(n) {
    return Number(n.toFixed(2));
  }

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementSize = canvasSize / 10;

    startGame();
}

function startGame() {    
    console.log({canvasSize, elementSize});

    game.font = elementSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100)
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map, mapRows, mapRowCols});

    showLives();

    enemyPosition = [];
    game.clearRect(0,0,canvasSize, canvasSize)
    
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementSize * (colI + 1);
            const posY = elementSize * (rowI + 1);

            if(col == 'O') {
               if(!playerPosition.x && !playerPosition.y) {
                playerPosition.x = posX;
                playerPosition.y = posY;
               }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemyPosition.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;
    
    if (giftCollision) {
        levelWin();
    }

    const enemyCollision = enemyPosition.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
      });

    if (enemyCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    startGame();
}

function levelFail() {
    console.log('Chocaste contra un enemigo :(');
    lives--;

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    } 
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log('Terminaste el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = +((Date.now()-timeStart)/1000);

    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'superaste el record';
        } else {
            pResult.innerHTML = 'Lo siento, no superaste el reto';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Primera vez? trata de superar tu tiempo';
    }
    console.log({recordTime, playerTime});
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART'])
    
    spanLives.innerHTML = emojis["HEART"].repeat(lives)
}

function showTime() {
    spanTime.innerHTML = +((Date.now()-timeStart)/1000);
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
    }

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    switch (event.key) {
        case 'ArrowUp': moveUp();
        break;

        case 'ArrowLeft': moveLeft();
        break;

        case 'ArrowRight': moveRight();
        break;

        case 'ArrowDown': moveDown();
        break;

        default: break;
    }
}

function moveUp() {
    console.log('Me quiero mover hacia arriba');
    if((playerPosition.y - elementSize) < elementSize ) {
        console.log('OUT');
    } else {
        playerPosition.y -= elementSize;
        startGame();
    }
}

function moveLeft() {
    console.log('Me quiero mover hacia izquierda');
    if((playerPosition.x - elementSize) < elementSize ) {
        console.log('OUT');
    } else {
        playerPosition.x -= elementSize;
        startGame();
    }
}

function moveRight() {
    console.log('Me quiero mover hacia derecha');
    if((playerPosition.x + elementSize) > canvasSize ) {
        console.log('OUT');
    } else {
        playerPosition.x += elementSize;
        startGame();
    }
}

function moveDown() {
    console.log('Me quiero mover hacia abajo');
    if((playerPosition.y + elementSize) > canvasSize ) {
        console.log('OUT');
    } else {
        playerPosition.y += elementSize;
        startGame();
    }
}



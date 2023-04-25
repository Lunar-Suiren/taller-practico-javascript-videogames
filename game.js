const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up-b');
const btnLeft = document.querySelector('#left-b');
const btnRight = document.querySelector('#right-b');
const btnDown = document.querySelector('#down-b');

let canvasSize;
let elementSize;

const playerPosition = {
    x: undefined,
    y: undefined,
};

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementSize = (canvasSize / 10)-1;

    startGame();
}

function startGame() {    
    console.log({canvasSize, elementSize});

    game.font = elementSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[0];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map( row => row.trim().split(''));
    console.log({map, mapRows});


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
            };

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();

    // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10; col++) {
    //         game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementSize * col, elementSize * row);   
    //     }
    // }

    // window.innerHeight
    // window.innerWidth

    // game.fillRect(0,50,100,100)
    // game.clearRect(50,50,50,50);

    // game.font = '25px Verdana';
    // game.fillStyle = 'purple';
    // game.textAlign = 'end';
    // game.fillTest('GameText', 25, 25);
}

function movePlayer(){
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
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



const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerImage = new Image();
playerImage.src = 'player.png'; // Set the path to your player image

const player = {
    width: 55,
    height: 55,
    x: 150,
    y: canvas.height / 2,
    speed: 5.5,
    velocityY: 0,
    flyStrength: -5,
    grounded: false,
    image: playerImage
};

const gravity = 0.4;
const groundHeight = 50;

const island = {
    x: 150,
    y: canvas.height - groundHeight - 25,
    width: 80,
    height: 100
};

const keys = {
    left: false,
    right: false,
    up: false
};

const stones = [];
const stoneWidth = 100;
const stoneHeight = 100;
const stoneSpeed = 26;

let gameOver = false;
let hoverTimeout = null;
let startTime = null;
let elapsedTime = 0;

function createStone() {
    const yPosition = Math.random() * (canvas.height - stoneHeight);
    stones.push({
        x: canvas.width,
        y: yPosition,
        width: stoneWidth,
        height: stoneHeight,
        speed: stoneSpeed
    });
}

function updateStones() {
    for (let i = stones.length - 1; i >= 0; i--) {
        stones[i].x -= stones[i].speed;
        if (stones[i].x + stones[i].width < 0) {
            stones.splice(i, 1);
        }
    }
}

function drawStones() {
    context.fillStyle = 'red';
    for (const stone of stones) {
        context.fillRect(stone.x, stone.y, stone.width, stone.height);
    }
}

function checkCollisions() {
    for (const stone of stones) {
        if (player.x < stone.x + stone.width &&
            player.x + player.width > stone.x &&
            player.y < stone.y + stone.height &&
            player.y + player.height > stone.y) {
            gameOver = true;
            return;
        }
    }
}

window.addEventListener('keydown', function(e) {
    if (e.code === 'KeyA') keys.left = true;
    if (e.code === 'KeyD') keys.right = true;
    if (e.code === 'KeyW') keys.up = true;

    // Allow resetting the game when game over
    if (e.code === 'Space' && gameOver) {
        resetGame();
    }
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'KeyA') keys.left = false;
    if (e.code === 'KeyD') keys.right = false;
    if (e.code === 'KeyW') keys.up = false;
});

function update() {
    if (gameOver) return;

    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;
    if (keys.up) {
        player.velocityY = player.flyStrength;
    } else {
        player.velocityY += gravity;
    }

    player.y += player.velocityY;

    // Prevent player from falling below ground level
    if (player.y + player.height > canvas.height - groundHeight) {
        player.y = canvas.height - groundHeight - player.height;
        player.velocityY = 0;
        player.grounded = true;
        gameOver = true;
    } else {
        player.grounded = false;
    }

    // Prevent player from flying off the top of the screen
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }

    // Prevent player from flying off the left side of the screen
    if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
    }

    // Prevent player from flying off the right side of the screen
    if (player.x > canvas.width - player.width) {
        player.x = canvas.width - player.width;
        player.velocityX = 0;
    }

    // Collision detection with the island
    if (player.x < island.x + island.width &&
        player.x + player.width > island.x &&
        player.y + player.height > island.y &&
        player.y + player.height < island.y + island.height) {
        // Player is on top of the island
        player.y = island.y - player.height;
        player.velocityY = 0;
        player.grounded = true;
    }

    updateStones();
    checkCollisions();

    // Update elapsed time
    if (startTime !== null) {
        elapsedTime = performance.now() - startTime;
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player with image
    if (player.image.complete) { // Ensure the image is loaded
        context.drawImage(player.image, player.x, player.y, player.width, player.height);
    }
    else {
        // Fallback to a rectangle if image is not loaded
        context.fillStyle = 'green';
        context.fillRect(player.x, player.y, player.width, player.height);
    }

    // Draw stones
    drawStones();

    // Draw island
    context.fillStyle = 'blue';
    context.fillRect(island.x, island.y, island.width, island.height);

    // Draw ground
    context.fillStyle = 'red';
    context.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    // Draw timer
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = Math.floor(elapsedTime % 1000);
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.textAlign = 'right';
    context.fillText(`Time: ${seconds}s ${milliseconds}ms`, canvas.width - 10, 30);

    if (gameOver) {
        // Display Game Over message
        context.fillStyle = 'yellow';
        context.font = '48px serif';
        context.textAlign = 'center';
        context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
        context.font = '24px serif';
        context.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 20);

        // Display final time under game over title
        context.fillText(`Final Time: ${seconds}s ${milliseconds}ms`, canvas.width / 2, canvas.height / 2 + 60);
    }
}

function resetGame() {
    player.x = 120;
    player.y = canvas.height / 2;
    player.velocityY = 0;
    player.grounded = false;
    stones.length = 0;
    gameOver = false;
    startTime = performance.now(); // Reset start time
    elapsedTime = 0;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

setInterval(createStone, 2000); // Create a new stone every 2 seconds

// Mouse hover detection
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mouseX >= player.x && mouseX <= player.x + player.width &&
        mouseY >= player.y && mouseY <= player.y + player.height) {
        if (!hoverTimeout) {
            hoverTimeout = setTimeout(() => {
                gameOver = true;
            }, 1000);
        }
    } else {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
    }
});

startTime = performance.now(); // Initialize start time when game starts
gameLoop();

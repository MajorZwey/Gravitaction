const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    width: 20,
    height: 30,
    x: 180,
    y: canvas.height / 2,
    speed: 5.5,
    velocityY: 0,
    flyStrength: -10,
    grounded: false
};

const gravity = 0.4;
const groundHeight = 50;

const island = {
    x: 150,
    y: canvas.height - groundHeight - 25,
    width: 80,
    height: 25
};

const keys = {
    left: false,
    right: false,
    up: false
};

let gameOver = false;

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
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    context.fillStyle = 'darkgrey';
    context.fillRect(player.x, player.y, player.width, player.height);

    // Draw island
    context.fillStyle = 'green';
    context.fillRect(island.x, island.y, island.width, island.height);

    // Draw ground
    context.fillStyle = 'red';
    context.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    if (gameOver) {
        // Display Game Over message
        context.fillStyle = 'white';
        context.font = '48px serif';
        context.textAlign = 'center';
        context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
        context.font = '24px serif';
        context.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 20);
    }
}

function resetGame() {
    player.x = 100;
    player.y = canvas.height / 2;
    player.velocityY = 0;
    player.grounded = false;
    gameOver = false;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

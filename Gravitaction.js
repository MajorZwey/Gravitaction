const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    width: 20,
    height: 30,
    x: 100,
    y: canvas.height / 2,
    speed: 5.5,
    velocityY: 0,
    flyStrength: -10,
    grounded: false
};

const gravity = 0.4;
const groundHeight = 50;

const keys = {
    left: false,
    right: false,
    up: false
};

window.addEventListener('keydown', function(e) {
    if (e.code === 'KeyA') keys.left = true;
    if (e.code === 'KeyD') keys.right = true;
    if (e.code === 'KeyW') keys.up = true;
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'KeyA') keys.left = false;
    if (e.code === 'KeyD') keys.right = false;
    if (e.code === 'KeyW') keys.up = false;
});

function update() {
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
    } else {
        player.grounded = false;
    }

    // Prevent player from flying off the top of the screen
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    context.fillStyle = 'darkgrey';
    context.fillRect(player.x, player.y, player.width, player.height);

    // Island
    context.fillStyle = 'green';
    context.fillRect(150,550,80,25);

    // Draw ground
    context.fillStyle = 'red';
    context.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();


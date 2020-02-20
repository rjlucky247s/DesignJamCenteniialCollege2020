﻿// Create the canvas for the game to display
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Load the background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    // show the background image
    bgReady = true;
};
bgImage.src = "images/CampusMap.png";

// Player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function() {
    playerReady = true;
};
playerImage.src = "images/Player.png";

// Book image
var bookReady = false;
var bookImage = new Image();
bookImage.onload = function() {
    bookReady = true;
};
bookImage.src = "images/Book.png";

// Game objects
var player = {
    speed: 256 // movement in pixels per second
};
var book = {};
var booksCaught = 0;

// Handle keyboard controls
var keysDown = {};

// Check for keys when pressed. Pressed key represents keycode captured
addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the player and book positions when the player catches a book
var reset = function() {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    // Throw the book somewhere on the screen randomly
    book.x = 32 + (Math.random() * (canvas.width - 64));
    book.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects - change player position based on key pressed
var update = function(modifier) {
    if (38 in keysDown) { // Player is holding up key
        player.y -= player.speed * modifier;
    }
    if (40 in keysDown) { // Player is holding down key
        player.y += player.speed * modifier;
    }
    if (37 in keysDown) { // Player is holding left key
        player.x -= player.speed * modifier;
    }
    if (39 in keysDown) { // Player is holding right key
        player.x += player.speed * modifier;
    }

    // Check if player and book collide
    if (
        player.x <= (book.x + 32) &&
        book.x <= (player.x + 32) &&
        player.y <= (book.y + 32) &&
        book.y <= (player.y + 32)
    ) {
        ++booksCaught;
        reset();
    }
};

// Draw everything on the canvas
var render = function() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (playerReady) {
        ctx.drawImage(playerImage, player.x, player.y);
    }
    if (bookReady) {
        ctx.drawImage(bookImage, book.x, book.y);
    }

    // Display score and time 
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Book Antiqua";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Books Collected: " + booksCaught, 20, 20);
    ctx.fillText("Time: " + count, 20, 50);

    // Display game over message when timer finished
    if (finished === true) {
        ctx.fillText("Game over!", 200, 220);
    }

};

//Reset The Score
document.getElementById("myBtnn").addEventListener("click", function() {
    document.getElementById("resetSc").innerHTML = booksCaught = 0;
});

//Reset The Timer
document.getElementById("myBtnn").addEventListener("click", function() {
    document.getElementById("resetTm").innerHTML = count = 30;
});

//Reset The Entire Game
document.getElementById("myBtnn").addEventListener("click", function() {
    document.getElementById("resetGm").innerHTML = reset();
});

//Reset The Entire Game
document.getElementById("myBtnn").addEventListener("click", function() {
    document.getElementById("resetMa").innerHTML = main();
});



// Timer Code Block
var count = 30; // how many seconds the game lasts for - default 30
var finished = false;
var counter = function() {
    count = count - 1; // countown by 1 every second
    // when count reaches 0 clear the timer, hide book and layer and finish the game
    if (count <= 0) {

        // stop the timer
        clearInterval(counter);

        // set game to finished
        finished = true;
        count = 0;

        // hider book and player
        bookReady = false;
        playerReady = false;
    }
}

// timer interval is every second (1000ms)
setInterval(counter, 1000);

// The main game loop
var main = function() {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Start the Game!
var then = Date.now();
reset();
main();
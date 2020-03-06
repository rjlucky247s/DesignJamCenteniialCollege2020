// Create the canvas for the game to display
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 599;
canvas.height = 475;
canvas.setAttribute("class", "game-canvas");
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
var highscore = 0;

// Check for saved data
if (localStorage.getItem("highscore")) {
    highscore = localStorage.getItem("highscore");
}

// Handle keyboard controls
var keysDown = {};

// Check for keys when pressed. Pressed key represents keycode captured
addEventListener(
    "keydown",
    function(e) {
        keysDown[e.keyCode] = true;
    },
    false
);

addEventListener(
    "keyup",
    function(e) {
        delete keysDown[e.keyCode];
    },
    false
);

// Reset the player and book positions when the player catches a book
var reset = function() {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    // Throw the book somewhere on the screen randomly
    book.x = 32 + Math.random() * (canvas.width - 64);
    book.y = 32 + Math.random() * (canvas.height - 64);
};

// Restart the whole game without refreshing the page
var ResetGame = function() {
    if (booksCaught > highscore) {
        highscore = booksCaught;
        localStorage.setItem("highscore", highscore);
    }

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.speed = 256;

    booksCaught = 0;
    count = 80;
    finished = false;
    playerReady = true;
    bookReady = true;

    // Throw the book somewhere on the screen randomly
    book.x = 32 + Math.random() * (canvas.width - 64);
    book.y = 32 + Math.random() * (canvas.height - 64);
};

// Paused or Unpaused?
var paused = false;

// Update game objects - change player position based on key pressed
var update = function(modifier) {

    // Pause Game
    if (80 in keysDown) { // player pressed p
        paused = true;
        stopTimer = true;
    }

    if (38 in keysDown) {
        // Player holding up
        player.y -= player.speed * modifier;
        if (player.y <= 0) {
            player.y = 540;
        }
    }

    if (40 in keysDown) {
        // Player holding down
        player.y += player.speed * modifier;
        if (player.y >= 540) {
            player.y = 0;
        }
    }

    if (37 in keysDown) {
        // Player holding left
        player.x -= player.speed * modifier;
        if (player.x <= 0) {
            player.x = 540;
        }
    }

    if (39 in keysDown) {
        // Player holding right
        player.x += player.speed * modifier;
        if (player.x >= 540) {
            player.x = 0;
        }
    }

    // Check if player and book collide
    if (
        player.x <= book.x + 32 &&
        book.x <= player.x + 32 &&
        player.y <= book.y + 32 &&
        book.y <= player.y + 32
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
    var time = document.getElementById("time");
    var score = document.getElementById("score");
    var myHighscore = document.getElementById("highscore");

    score.innerText = booksCaught;
    time.innerText = count;
    myHighscore.innerText = highscore;

    // Display paused on screen when user clicks P
    if (paused === true) {
        ctx.fillStyle = "#aed26a";
        ctx.fillText("Paused!", 200, 220);
    }

    // Display game over message when timer finished
    if (finished === true) {
        ctx.fillStyle = "#fff";
        ctx.font = "104px Digital-7";
        ctx.fillText("Game over!", 100, 250);
    }
};

//Reset The Entire Game
document.getElementById("myBtnn").addEventListener("click", function() {
    document.getElementById("resetGame").innerHTML = ResetGame();
});

// Timer Code Block
var count = 80; // how many seconds the game lasts for - default 30
var finished = false;
var counter = function() {
    count = stopTimer ? count : count - 1; // countown by 1 every second
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
};

// Popup menu
var popupunderlayer = document.getElementById("popup-underlayer");
// Popup menu
var popup = document.getElementById("popup");
// Popup menu close button
var close = document.getElementById("close");

// use show popup when you need to use it
//   addEventListener("keydown", showPopup);

// change these innerText properties to fill in info for title n message
var popupTitle = document.querySelector(".popup-title");
var popupMessage = document.querySelector(".popup-message");

var targetBooksCaught = [2, 4, 2, 3, 4, 3, 5, 2, 1, 3, 3, 3, 1, 4, 4, 1, 2, 3, 4, 1, 5, 5, 2];
var popupTitles = ["About Centennial", "CCSAI", "IT Help Desk", "Prayer Room", "Centre for Academic English", "Life Safety and Security",
    "Assesment Centre", "Bookstore", "Athletics and Recreation", "CCSLD", "The Hub (Enrolment Services)", "Student Experience Office (SEO)",
    "ACCEL", "CALCS", "CAPS", "Alumni Engagement", "ARIES", "Food Services Outlet",
    "International Education Centre", "GCEI", "Community Outreach Office",
    "Library and Learning Centres", "Career Services and Cooperative Eduction", "Inclusive Washrooms"
];

var popupMessages = [
    "Centennial College's five campuses are home to eight schools. Part-time Learning courses and programs are available at all locations and online.",
    "CCSAI also known as Centennial College Association Inc, is a not for profit organization that represents the students of Centennial College.",
    "The Information Technology Services department at Centennial College provides students and staff with the resources and services required to support teaching and learning.",
    "Centennial College offers private rooms for prayers on campus. We offer a welcoming environment for all regardless of their religion, spiritual beliefs or creed.",
    "The Centre for Academic English (CAE) provides free English tutoring and workshops for Centennial students at all campuses.",
    "In case of emergency, use any Campus pay phone or your cell phone for free to call the Emergency Help Line at 416-439-4357 (HELP), or from any internal college phone call Ext. 2020.",
    "Skills assessment is a testing system to measure your English and mathematical skill level. Skills Assessment results are valid for two (2) calendar years and may not be repeated unless approved.",
    "Centennial College’s bookstore has all the textbooks and supplies you'll need for your studies, along with college-themed clothes to show your school spirit.",
    "Centennial offers many sports from baseball, basketball, volleyball, soccer, badminton and cross country.",
    "The Co-Curricular Student Learning and Development aka CCSLD is about giving students learning opportunities that link academic program content from the classroom with an applied experience.",
    "College hours for fee payments, registration and all Enrolment Services. Please note, Enrolment Services does not cover OSAP.",
    "The Student Experience Office (SEO) achieves our commitment to Make a Bigger Promise to students by providing conflict and conduct management services rooted in deep transformative educational approaches that enhance student learning, student persistence, and student-community development.",
    "At ACCEL aka Accelerator for Centennial Community Entrepreneurs and Leaders, people can learn how to start a business and even apply for funding to accelerate success.",
    "The Centre for Accessible Learning and Counselling Services (CALCS) provides a range of programs and services aimed to empower students in meeting their wellness goals, accommodation and disability-related needs, and creating a more accessible campus community.",
    "Centennial Advising and Pathways Services (CAPS) is here to support you while you’re at Centennial, by giving you advice, information and resources as you go through school. CAPS advisors help you identify your goals, make a plan for success, and connect you with the people and experiences you want to see at the College.",
    "The Centennial College Alumni Association is your official link to Centennial College and all that it will continue to offer you. As a Centennial College graduate, you are a lifetime member and eligible to take advantage of the many programs and services offered.",
    "We committed to Drive Innovation and Entrepreneurship by integrating key related functions within the College. This is why we have brought the Applied Research and Innovation Centre (ARIC), the Centre of Entrepreneurship (COE), and the newly formed Wearable, Interactive, and Mobile Technology Access centre for Health (WIMTACH) together into a single unit named ARIES",
    "Centennial College offers great campus dining options across different campuses.",
    "Our International advisors and Admissions teams are here to help you be successful at Centennial. Through our International Education Centre, you can benefit from an orientation to student life in Canada, attend fun events, and access services like health insurance, advising, transition support, and so much more.",
    "The Centre for Global Citizenship, Education & Inclusion (GCEI) encourages students to engage in transformative education for social good through global citizenship learning. It is also committed to eliminating all forms of discrimination and harassment by creating an environment of inclusion in teaching, learning, employment and support services.",
    "The Community Outreach Office, established in 2009, provides outreach and engagement activities to promote access to post-secondary education for people who are typically under-represented in post-secondary education, with a current focus on youth from underserved neighbourhoods, Indigenous persons and women in non-traditional careers.",
    "The Centennial College Learning Centre is committed to the promotion of independent and active learning for all Centennial College students. Come to the Learning Centre for one-on-one and small group support that will help you engage your mind and empower your learning.",
    "The Career Services and Co-operative Education team gives students and graduates the confidence and tools for career success from the first semester to two years after graduation.",
    "The inclusive washrooms can be located at Progress, Morningside, Ashtonbee, Downsview campuses and the Story Arts Centre."
];
// close popup menu
close.addEventListener("click", closePopup);

function closePopup() {
    popupunderlayer.style.display = "none";
    popup.style.display = "none";
    popUpNotActive = true;
    stopTimer = false;
    targetBooks += targetBooksCaught[bookCaughtIndex];
}

// You can change this but i increase the index before i set it
var titleIndex = -1;
var messageIndex = -1;
var bookCaughtIndex = -1;

function showPopup() {
    if (titleIndex < popupTitles.length) {
        titleIndex++;
        messageIndex++;
        popupTitle.innerText = popupTitles[titleIndex];
        popupMessage.innerText = popupMessages[messageIndex];
    }
    popupunderlayer.style.display = "block";
    popup.style.display = "block";
}

// timer interval is every second (1000ms)
setInterval(counter, 1000);
var popUpNotActive = true;
var stopTimer = false;
var targetBooks = 3;

// The main game loop
var main = function() {

    // Unpause
    if (79 in keysDown) { // player pressed p
        paused = false;
        stopTimer = false;
    }

    var now = Date.now();

    if (!paused) {
        var delta = now - then;

        update(delta / 1000);
        render(delta / 1000);
    }
    // If the popup isnt shown yet at that point, if you dont do this, you will not be able to close it
    if (booksCaught == targetBooks && popUpNotActive) {
        popUpNotActive = false;
        stopTimer = true;
        // You can change this but i increase the index before i set it in the counter
        // If the index is less than the max amount in the array, increase else leave it
        bookCaughtIndex =
            bookCaughtIndex < targetBooksCaught.length ?
            bookCaughtIndex + 1 :
            bookCaughtIndex + 1;
        showPopup();
    }
    then = now;

    // Request to do this again
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
    w.requestAnimationFrame ||
    w.webkitRequestAnimationFrame ||
    w.msRequestAnimationFrame ||
    w.mozRequestAnimationFrame;

// Start the Game!
var then = Date.now();
reset();
main();
// Getting a random integer between 2 numbers, inclusive
// source:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// October 17, 2018
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

const canvasX = 505;
const canvasY = 606;
const rows = 7; // inclused 0.5 unusable row at top and bottom
const columns = 5;
const xBlockLen = canvasX / columns;
const yBlockLen = canvasY / rows;
const xMin = xBlockLen * 0.5;
const xMax = xBlockLen * (columns - 2);
const yMin = yBlockLen * 0.5;
const yMax = yBlockLen * (rows - 3);
const collisionCoefficient = 0.7;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Speed between 0.5 and 2
    this.speed = Math.random() * (2 - 0.5) + 0.5;

    // Vertical position; 0 = top *stone* row
    // 1 = middle
    // 2 = bottom
    this.x = -xBlockLen;
    this.y = yBlockLen * (getRandomIntInclusive(1,3) - 0.5);
};

Enemy.prototype.reinitialize = function() {
    this.speed = Math.random() * (2 - 0.5) + 0.5;
    this.x = -xBlockLen;
    this.y = yBlockLen * (getRandomIntInclusive(1,3) - 0.5);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += 3 * dt;

    // Reinitialize enemy if offscreen
    if ( this.x > canvasX ) {
        this.reinitialize();
    }

    // Handle collision with player if occurs
    let xDist = Math.abs(this.x - player.x);
    let yDist = Math.abs(this.y - player.y);
    let xCollisionDistance = xBlockLen * collisionCoefficient;
    let yCollisionDistance = xBlockLen * collisionCoefficient;
    if (xDist <= xCollisionDistance && yDist <= yCollisionDistance) {
        player.reinitialize();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    setInterval(this.update(this.speed), 100);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 2 * xBlockLen;
        this.y = 4.5 * yBlockLen;
    }

    // Methods
    update(key) {
        // Move up/down within limits  
        if (key == 'up' && this.y >= yMin) {
            this.y -= yBlockLen;
        } else if (key == 'down' && this.y <= yMax) {
            this.y += yBlockLen;
        }
        
        // Move left/right within limits
        if (key == 'left' && this.x >= xMin) {
            this.x -= xBlockLen;
        } else if (key == 'right' && this.x <= xMax) {
            this.x += xBlockLen;
        } 

        // Win (reinitialize) if made it to top row (water)
        if (this.y < yMin) {
            this.reinitialize();
        }
    }

    reinitialize() {
        this.x = 2 * xBlockLen;
        this.y = 4.5 * yBlockLen;
    }
        
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(key) {
        console.log(key);
        if (key == 'up') { this.update('up');}
        else if (key == 'left') { this.update('left')}
        else if (key == 'right') { this.update('right')}
        else if (key == 'down') { this.update('down')}
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let enemy1 = new Enemy;
let enemy2 = new Enemy;
let enemy3 = new Enemy;
let enemy4 = new Enemy;

let allEnemies = [enemy1, enemy2, enemy3, enemy4];

let player = new Player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

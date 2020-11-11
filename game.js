/* eslint-disable no-alert */
/* eslint-disable operator-linebreak */

// constants
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// variables
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;

// initialize bricks array
const bricks = [];
let c = 0;
let r = 0;
// creates bricks
function initBricks() {
  for (c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r += 1) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

// function for mouse controls
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// function for pressing down on arrow key controls
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

// function for up presses on arrow key controls
function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// event listeners for keyboard and mouse controls
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// function for collision with ball and bricks
function collisionDetection() {
  for (c = 0; c < brickColumnCount; c += 1) {
    for (r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          //  counts score on brick collision
          if (r % 2 !== 0) score += 1;
          else score += 2;
          if (score === 36) {
            //  game win alert
            alert('YOU WIN, CONGRATS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// function for the score
function drawScore() {
  ctx.font = '16px Helvetica';
  ctx.fillStyle = 'whitesmoke';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// function for the lives
function drawLives() {
  ctx.font = '16px Helvetica';
  ctx.fillStyle = 'whitesmoke';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// function to draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#8D99AE';
  ctx.fill();
  ctx.closePath();
}

// function to draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#e0fbfc';
  ctx.fill();
  ctx.closePath();
}

// function to draw the bricks
function drawBricks() {
  for (c = 0; c < brickColumnCount; c += 1) {
    for (r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        // sets colors of bricks
        if (r % 2 !== 0) {
          if (c % 2 !== 0) {
            ctx.fillStyle = '#00b4d8';
          } else {
            ctx.fillStyle = '#72EFDD';
          }
        } else if (c % 2 !== 0) ctx.fillStyle = '#5E60CE';
        else ctx.fillStyle = '#0077b6';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// function to draw all the elements
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw objects
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // bounce the ball off the canvas
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives -= 1;
      if (!lives) {
        // game over alert
        alert(`GAME OVER\nSCORE: ${score}`);
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  // checks for arrow keys
  function checkKeys() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
  }
  // function for ball movement
  function moveBall() {
    x += dx;
    y += dy;
  }
  checkKeys();
  moveBall();
  requestAnimationFrame(draw);
}
// starts game
initBricks();
draw();

const content = document.getElementById("content");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CONTENT_HEIGHT = content.clientHeight;
const CANVAS_WIDTH = content.clientWidth;
const CANVAS_HEIGHT = CONTENT_HEIGHT / 3;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const meokguImg = new Image(100, 70);
meokguImg.src = "meokguImg.png";
const meonjiImg = new Image(50, 50);
meonjiImg.src = "meonjiImg.png";

// 먹구
const meokgu = {
  x: 30,
  y: CANVAS_HEIGHT - 70,
  width: 100,
  height: 70,
  jumpHeight: 80,
  draw() {
    ctx.fillStyle = "grey";
    ctx.drawImage(meokguImg, this.x, this.y, this.width, this.height);
  },
};

// 장애물
class Meonji {
  constructor() {
    this.x = CANVAS_WIDTH + 50;
    this.y = CANVAS_HEIGHT - 50;
    this.width = 50;
    this.height = 50;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.drawImage(meonjiImg, this.x, this.y, this.width, this.height);
  }
}

// 애니메이션
let animation;
let timer = 0;
let isHeJumping = false;
let jumpCount = 0;

const meonjis = [];

function game() {
  animation = requestAnimationFrame(game);
  timer++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1초마다 장애물 생성
  if (timer % 144 === 0) {
    const meonji = new Meonji();
    meonjis.push(meonji);
  }

  // 장애물 애니메이션
  meonjis.forEach((meonji, index, arr) => {
    if (meonji.x < 0) {
      arr.splice(index, 1);
    }
    meonji.x -= 2;
    checkCollision(meokgu, meonji);
    meonji.draw();
  });

  // 먹구 점프 상태 제어
  if (isHeJumping === true) {
    meokgu.y -= 2;
    jumpCount += 2;
  }
  if (meokgu.y <= 0) {
    isHeJumping = false;
  }
  if (isHeJumping === false) {
    if (meokgu.y < CANVAS_HEIGHT - 70) meokgu.y += 2;
  }
  if (jumpCount > meokgu.jumpHeight) {
    isHeJumping = false;
    jumpCount = 0;
  }

  meokgu.draw();
}
game();

// 이벤트리스너
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") isHeJumping = true;
});

// 충돌 체크하기
function checkCollision(meokgu, meonji) {
  const xDiff = meonji.x - (meokgu.x + meokgu.width);
  const yDiff = meonji.y - (meokgu.y + meokgu.height);
  if (xDiff < 0 && yDiff < 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation);
  }
}

// 모바일용 점프 버튼 생성
const filter = ["win16", "win32", "win64", "mac"];
const userPlatform = navigator.platform.toLocaleLowerCase();
if (filter.indexOf(userPlatform) > -1) {
  const buttonBox = document.getElementById("button_box");
  buttonBox.style.display = "none";
}

const jumpButton = document.getElementById("jump_button");

jumpButton.addEventListener("click", function (e) {
  isHeJumping = true;
});

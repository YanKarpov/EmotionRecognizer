const canvas = document.querySelector("#paintField");
const clearBtn = document.querySelector("#clear");
const sadBtn = document.querySelector("#sad");
const happyBtn = document.querySelector("#happy");
const angryBtn = document.querySelector("#angry");
const surprisedBtn = document.querySelector("#surprised");
const trainBtn = document.querySelector("#train");
const predictBtn = document.querySelector("#predict");

const ctx = canvas.getContext("2d");
const paintField = new Array(100).fill(false);
const trainData = [];
let mouseDown = false;
let happyCount = 0;
let sadCount = 0;
let angryCount = 0;
let surprisedCount = 0;

function drawGrid() {
  ctx.strokeStyle = "#CCC";
  for (let i = 1; i < 10; i++) {
    ctx.moveTo(0, i * 40);
    ctx.lineTo(400, i * 40);
    ctx.moveTo(i * 40, 0);
    ctx.lineTo(i * 40, 400);
  }
  ctx.stroke();
}

function clearCanvas() {
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, 400, 400);
  drawGrid();
}

function drawSquare(row, column, color) {
  ctx.fillStyle = color;
  ctx.fillRect(column * 40 + 1, row * 40 + 1, 38, 38);
}

function draw(event) {
  const offsetX = Math.min(Math.max(event.offsetX, 0), 399);
  const offsetY = Math.min(Math.max(event.offsetY, 0), 399);

  const rowIndex = Math.floor(offsetY / 40);
  const columnIndex = Math.floor(offsetX / 40);
  const arrayIndex = rowIndex * 10 + columnIndex;

  if (arrayIndex >= 0 && arrayIndex < paintField.length) {
    paintField[arrayIndex] = true;
    drawSquare(rowIndex, columnIndex, "green");
  }
}

function clearField() {
  paintField.fill(false);
  clearCanvas();
}

function updateInterface() {
  happyBtn.innerText = `😀 ${happyCount}`;
  sadBtn.innerText = `🙁 ${sadCount}`;
  angryBtn.innerText = `😡 ${angryCount}`;
  surprisedBtn.innerText = `😲 ${surprisedCount}`;
}

function storeResult(value) {
  trainData.push({ paintField: [...paintField], label: value });
  updateInterface();
  clearField();
}

document.addEventListener("mousedown", () => (mouseDown = true));
document.addEventListener("mouseup", () => (mouseDown = false));

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) draw(e);
});

clearBtn.addEventListener("click", clearField);

happyBtn.addEventListener("click", () => {
  happyCount += 1;
  storeResult([1, 0, 0, 0]);
});

sadBtn.addEventListener("click", () => {
  sadCount += 1;
  storeResult([0, 1, 0, 0]);
});

angryBtn.addEventListener("click", () => {
  angryCount += 1;
  storeResult([0, 0, 1, 0]);
});

surprisedBtn.addEventListener("click", () => {
  surprisedCount += 1;
  storeResult([0, 0, 0, 1]);
});

predictBtn.addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ paintField })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
  })
  .catch(error => console.error('Error:', error));
});

trainBtn.addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/train", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ trainData })
  })
  .then(response => response.json())
  .then(data => {
    alert("Я обучился!");
    predictBtn.disabled = false;
  })
  .catch(error => console.error('Error:', error));
});

updateInterface();
clearCanvas();

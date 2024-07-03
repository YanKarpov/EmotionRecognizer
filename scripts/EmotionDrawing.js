const canvas = document.querySelector("#paintField");
const clearBtn = document.querySelector("#clear");
const sadBtn = document.querySelector("#sad");
const happyBtn = document.querySelector("#happy");
const angryBtn = document.querySelector("#angry");
const surprisedBtn = document.querySelector("#surprised");
const trainBtn = document.querySelector("#train");
const predictBtn = document.querySelector("#predict");
const saveBtn = document.querySelector("#save");
const colorPicker = document.querySelector("#colorPicker");
const loadInput = document.querySelector("#load");
const fileNameSpan = document.querySelector("#file-name");

loadInput.addEventListener("change", (event) => {
  const fileName = event.target.files[0] ? event.target.files[0].name : "Файл не выбран";
  fileNameSpan.textContent = fileName;
});

// Контекст рисования на canvas
const ctx = canvas.getContext("2d");

// Массив для хранения состояния рисования (10x10 пикселей)
const paintField = new Array(100).fill(false);

// Массив данных для обучения модели
const trainData = [];

let mouseDown = false;
let touchActive = false;
let happyCount = 0;
let sadCount = 0;
let angryCount = 0;
let surprisedCount = 0;
let selectedColor = colorPicker.value;

/**
 * Рисует сетку на canvas.
 */
const drawGrid = () => {
  ctx.strokeStyle = "#CCC";

  for (let i = 1; i < 10; i++) {
    ctx.moveTo(0, i * 40);
    ctx.lineTo(400, i * 40);
    ctx.moveTo(i * 40, 0);
    ctx.lineTo(i * 40, 400);
  }

  ctx.stroke();
};

/**
 * Очищает canvas и перерисовывает сетку.
 */
const clearCanvas = () => {
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, 400, 400);
  drawGrid();
};

/**
 * Рисует квадрат заданного цвета в указанной ячейке на canvas.
 * @param {number} row - Номер строки ячейки
 * @param {number} column - Номер столбца ячейки
 * @param {string} color - Цвет для заливки квадрата
 */
const drawSquare = (row, column, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(column * 40 + 1, row * 40 + 1, 38, 38);
};

/**
 * Обработчик события для рисования на canvas при движении мыши или сенсора.
 * @param {number} offsetX - Смещение по оси X
 * @param {number} offsetY - Смещение по оси Y
 */
const draw = (offsetX, offsetY) => {
  const rowIndex = Math.floor(offsetY / 40);
  const columnIndex = Math.floor(offsetX / 40);
  const arrayIndex = rowIndex * 10 + columnIndex;

  if (arrayIndex >= 0 && arrayIndex < paintField.length && !paintField[arrayIndex]) {
    paintField[arrayIndex] = true;
    drawSquare(rowIndex, columnIndex, selectedColor);
  }
};

/**
 * Обработчик события для движения мыши по canvas.
 * @param {MouseEvent} event - Событие мыши
 */
const handleMouseMove = (event) => {
  if (!mouseDown) return;
  const offsetX = Math.min(Math.max(event.offsetX, 0), 399);
  const offsetY = Math.min(Math.max(event.offsetY, 0), 399);
  draw(offsetX, offsetY);
};

/**
 * Обработчик события для движения пальца по canvas.
 * @param {TouchEvent} event - Сенсорное событие
 */
const handleTouchMove = (event) => {
  if (!touchActive) return;
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  const offsetX = Math.min(Math.max(touch.clientX - rect.left, 0), 399);
  const offsetY = Math.min(Math.max(touch.clientY - rect.top, 0), 399);
  draw(offsetX, offsetY);
};

const clearField = () => {
  paintField.fill(false);
  clearCanvas();
};

const updateInterface = () => {
  happyBtn.innerText = `😀 ${happyCount}`;
  sadBtn.innerText = `🙁 ${sadCount}`;
  angryBtn.innerText = `😡 ${angryCount}`;
  surprisedBtn.innerText = `😲 ${surprisedCount}`;
};

/**
 * Сохраняет текущее состояние рисунка и его метку в массив данных обучения.
 * @param {number[]} value - Метка рисунка (например, [1, 0, 0, 0] для счастливого, [0, 1, 0, 0] для грустного)
 */
const storeResult = (value) => {
  trainData.push({ paintField: [...paintField], label: value });
  if (value[0] === 1) happyCount++;
  else if (value[1] === 1) sadCount++;
  else if (value[2] === 1) angryCount++;
  else if (value[3] === 1) surprisedCount++;
  updateInterface();
  clearField();
};

// Сохраняет данные обучения в файл JSON
const saveTrainingData = () => {
  const jsonData = JSON.stringify(trainData);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "trainData.json";
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    alert("Данные обучения сохранены в файл trainData.json!");
  }, 0);
};

// Загружает данные обучения из файла JSON
const loadTrainingData = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const jsonData = e.target.result;
      const loadedData = JSON.parse(jsonData);
      const existingDataCount = trainData.length;

      loadedData.forEach((data) => {
        const duplicate = trainData.some(
          (d) => JSON.stringify(d.paintField) === JSON.stringify(data.paintField)
        );
        if (!duplicate) {
          trainData.push(data);
          if (data.label[0] === 1) happyCount++;
          if (data.label[1] === 1) sadCount++;
          if (data.label[2] === 1) angryCount++;
          if (data.label[3] === 1) surprisedCount++;
        }
      });

      if (trainData.length > existingDataCount) {
        updateInterface();
        alert("Данные обучения загружены!");
      } else {
        alert("Все загруженные данные уже существуют в наборе данных!");
      }
    } catch (error) {
      alert("Ошибка при загрузке данных: " + error.message);
    }
  };

  reader.readAsText(file);
};

loadInput.addEventListener("change", loadTrainingData);

// Добавление обработчиков событий для взаимодействия с мышью и сенсорами
document.addEventListener("mousedown", () => (mouseDown = true));
document.addEventListener("mouseup", () => (mouseDown = false));
document.addEventListener("touchstart", () => (touchActive = true));
document.addEventListener("touchend", () => (touchActive = false));

canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("touchmove", handleTouchMove);

clearBtn.addEventListener("click", clearField);

happyBtn.addEventListener("click", () => {
  storeResult([1, 0, 0, 0]);
});

sadBtn.addEventListener("click", () => {
  storeResult([0, 1, 0, 0]);
});

angryBtn.addEventListener("click", () => {
  storeResult([0, 0, 1, 0]);
});

surprisedBtn.addEventListener("click", () => {
  storeResult([0, 0, 0, 1]);
});

predictBtn.addEventListener("click", async () => {
  const inputTensor = preprocessDrawing(paintField);
  const prediction = model.predict(inputTensor);
  const [happiness, sadness, anger, surprise] = await prediction.data();

  const emotions = ["счастливое", "грустное", "злое", "удивленное"];
  const scores = [happiness, sadness, anger, surprise];
  const maxIndex = scores.indexOf(Math.max(...scores));

  alert(
    `Я думаю это ${emotions[maxIndex]} лицо!\nСчастье: ${Math.round(
      happiness * 100
    )}% Грусть: ${Math.round(sadness * 100)}% Злость: ${Math.round(
      anger * 100
    )}% Удивление: ${Math.round(surprise * 100)}%`
  );
});

trainBtn.addEventListener("click", async () => {
  await trainModel(trainData);
  predictBtn.disabled = false;
  alert("Я обучился!");
});

saveBtn.addEventListener("click", saveTrainingData);

// Обновление цвета рисования при изменении цвета в colorPicker
colorPicker.addEventListener("input", (e) => {
  selectedColor = e.target.value;
});

// Начальная настройка интерфейса
updateInterface();
clearCanvas();


const canvas = document.querySelector("#paintField"); // Элемент canvas, на котором происходит рисование
const clearBtn = document.querySelector("#clear"); // Кнопка для очистки поля
const sadBtn = document.querySelector("#sad"); // Кнопка для отметки грустного рисунка
const happyBtn = document.querySelector("#happy"); // Кнопка для отметки счастливого рисунка
const trainBtn = document.querySelector("#train"); // Кнопка для запуска обучения нейронной сети
const predictBtn = document.querySelector("#predict"); // Кнопка для предсказания на основе текущего рисунка
const ctx = canvas.getContext("2d"); // Контекст для рисования на canvas
const paintField = new Array(100).fill(false); // Массив, представляющий поле рисования (10x10)
const trainData = []; // Массив для хранения данных обучения
let mouseDown = false; // Переменная для отслеживания состояния нажатия мыши
let happyCount = 0; // Счетчик для счастливых рисунков
let sadCount = 0; // Счетчик для грустных рисунков

// Функция для рисования сетки на canvas
function drawGrid() {
  ctx.strokeStyle = "#CCC"; // Цвет линий сетки

  for (let i = 1; i < 10; i++) {
    // Рисование горизонтальных и вертикальных линий сетки
    ctx.moveTo(0, i * 40);
    ctx.lineTo(400, i * 40);
    ctx.moveTo(i * 40, 0);
    ctx.lineTo(i * 40, 400);
  }

  ctx.stroke(); // Применение изменений на canvas
}

// Функция для очистки canvas
function clearCanvas() {
  ctx.fillStyle = "#FFF"; // Установка белого фона
  ctx.fillRect(0, 0, 400, 400); // Заполнение всего canvas белым цветом
  drawGrid(); // Рисование сетки
}

// Функция для рисования квадрата на canvas
function drawSquare(row, column, color) {
  ctx.fillStyle = color; // Установка цвета заливки
  ctx.fillRect(column * 40 + 1, row * 40 + 1, 38, 38); // Рисование квадрата в соответствующей ячейке
}

// Функция для рисования на canvas при движении мыши
function draw(event) {
  const rowIndex = Math.floor(event.offsetY / 40); // Определение строки на основе позиции мыши
  const columnIndex = Math.floor(event.offsetX / 40); // Определение столбца на основе позиции мыши
  const arrayIndex = rowIndex * 10 + columnIndex; // Вычисление индекса в массиве paintField
  paintField[arrayIndex] = true; // Обновление состояния ячейки
  drawSquare(rowIndex, columnIndex, "green"); // Рисование зеленого квадрата в соответствующей ячейке
}

// Функция для очистки поля рисования
function clearField() {
  paintField.fill(false); // Заполнение массива значениями false
  clearCanvas(); // Очистка canvas
}

// Функция для обновления интерфейса (текста кнопок)
function updateInterface() {
  happyBtn.innerText = `😀 ${happyCount}`; // Обновление текста кнопки happy
  sadBtn.innerText = `🙁 ${sadCount}`; // Обновление текста кнопки sad
}

// Функция для сохранения результата обучения
function storeResult(value) {
  trainData.push({ paintField: [...paintField], label: value }); // Добавление текущего состояния поля и метки в массив данных обучения
  updateInterface(); // Обновление интерфейса
}

// Добавление обработчиков событий для взаимодействия с мышью и кнопками
document.addEventListener("mousedown", () => (mouseDown = true)); // Обработчик нажатия мыши
document.addEventListener("mouseup", () => (mouseDown = false)); // Обработчик отпускания мыши

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) draw(e); // Если мышь нажата, рисовать
});

clearBtn.addEventListener("click", clearField); // Обработчик кнопки очистки

happyBtn.addEventListener("click", () => {
  happyCount += 1; // Увеличение счетчика счастливых рисунков
  storeResult([1, 0]); // Сохранение текущего рисунка как счастливого
  clearField(); // Очистка поля рисования
});

sadBtn.addEventListener("click", () => {
  sadCount += 1; // Увеличение счетчика грустных рисунков
  storeResult([0, 1]); // Сохранение текущего рисунка как грустного
  clearField(); // Очистка поля рисования
});

predictBtn.addEventListener("click", () => {
  const inputTensor = preprocessDrawing(paintField);
  const prediction = model.predict(inputTensor);
  const [happiness, sadness] = prediction.dataSync();

  alert(
    `Я думаю это ${
      happiness > sadness ? "счастливое" : "грустное"
    } лицо!\nСчастье: ${Math.round(happiness * 100)}% Грусть: ${Math.round(
      sadness * 100
    )}%`
  );
});

trainBtn.addEventListener("click", () => {
  trainModel(trainData).then(() => {
    predictBtn.disabled = false; // Включение кнопки предсказания после обучения
    alert("Я обучился!"); // Уведомление о завершении обучения
  });
});

// Начальная инициализация интерфейса и canvas
updateInterface(); // Обновление интерфейса
clearCanvas(); // Очистка canvas и рисование сетки

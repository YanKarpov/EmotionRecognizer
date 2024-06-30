// Получение элементов canvas и кнопок
const canvas = document.querySelector("#paintField"); // Элемент canvas для рисования
const clearBtn = document.querySelector("#clear"); // Кнопка для очистки canvas
const sadBtn = document.querySelector("#sad"); // Кнопка для отметки грустного рисунка
const happyBtn = document.querySelector("#happy"); // Кнопка для отметки счастливого рисунка
const angryBtn = document.querySelector("#angry"); // Кнопка для отметки злого рисунка
const surprisedBtn = document.querySelector("#surprised"); // Кнопка для отметки удивленного рисунка
const trainBtn = document.querySelector("#train"); // Кнопка для запуска обучения модели
const predictBtn = document.querySelector("#predict"); // Кнопка для предсказания эмоции на основе рисунка

// Контекст рисования на canvas
const ctx = canvas.getContext("2d");

// Массив для хранения состояния рисования (10x10 пикселей)
const paintField = new Array(100).fill(false);

// Массив данных для обучения модели
const trainData = [];

// Переменные для отслеживания состояния интерфейса
let mouseDown = false; // Флаг нажатия мыши
let happyCount = 0; // Счетчик счастливых рисунков
let sadCount = 0; // Счетчик грустных рисунков
let angryCount = 0; // Счетчик злых рисунков
let surprisedCount = 0; // Счетчик удивленных рисунков

/**
 * Рисует сетку на canvas.
 */
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

/**
 * Очищает canvas и перерисовывает сетку.
 */
function clearCanvas() {
  ctx.fillStyle = "#FFF"; // Установка белого фона
  ctx.fillRect(0, 0, 400, 400); // Заполнение всего canvas белым цветом
  drawGrid(); // Рисование сетки
}

/**
 * Рисует квадрат заданного цвета в указанной ячейке на canvas.
 * @param {number} row - Номер строки ячейки
 * @param {number} column - Номер столбца ячейки
 * @param {string} color - Цвет для заливки квадрата
 */
function drawSquare(row, column, color) {
  ctx.fillStyle = color; // Установка цвета заливки
  ctx.fillRect(column * 40 + 1, row * 40 + 1, 38, 38); // Рисование квадрата в заданных координатах
}

/**
 * Обработчик события для рисования на canvas при движении мыши.
 * @param {MouseEvent} event - Событие мыши
 */
function draw(event) {
  // Ограничиваем координаты курсора в пределах холста
  const offsetX = Math.min(Math.max(event.offsetX, 0), 399);
  const offsetY = Math.min(Math.max(event.offsetY, 0), 399);

  const rowIndex = Math.floor(offsetY / 40); // Определение строки по положению мыши
  const columnIndex = Math.floor(offsetX / 40); // Определение столбца по положению мыши
  const arrayIndex = rowIndex * 10 + columnIndex; // Индекс в массиве paintField

  // Проверяем, не выходит ли индекс за границы массива
  if (arrayIndex >= 0 && arrayIndex < paintField.length) {
    paintField[arrayIndex] = true; // Установка значения true для выбранной ячейки
    drawSquare(rowIndex, columnIndex, "green"); // Рисование зеленого квадрата в выбранной ячейке
  }
}

/**
 * Очищает поле рисования (paintField).
 */
function clearField() {
  paintField.fill(false); // Заполнение массива значениями false
  clearCanvas(); // Очистка canvas
}

/**
 * Обновляет текст кнопок для отображения текущего количества рисунков разных эмоций.
 */
function updateInterface() {
  happyBtn.innerText = `😀 ${happyCount}`; // Обновление текста кнопки happy
  sadBtn.innerText = `🙁 ${sadCount}`; // Обновление текста кнопки sad
  angryBtn.innerText = `😡 ${angryCount}`; // Обновление текста кнопки angry
  surprisedBtn.innerText = `😲 ${surprisedCount}`; // Обновление текста кнопки surprised
}

/**
 * Сохраняет текущее состояние рисунка и его метку в массив данных обучения.
 * @param {number[]} value - Метка рисунка (например, [1, 0, 0, 0] для счастливого)
 */
function storeResult(value) {
  trainData.push({ paintField: [...paintField], label: value }); // Добавление данных в массив trainData
  updateInterface(); // Обновление интерфейса после добавления данных
  clearField(); // Очистка поля рисования
}

// Добавление обработчиков событий для взаимодействия с мышью и кнопками
document.addEventListener("mousedown", () => (mouseDown = true)); // Нажатие кнопки мыши
document.addEventListener("mouseup", () => (mouseDown = false)); // Отпускание кнопки мыши

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) draw(e); // Вызов функции рисования при нажатой кнопке мыши
});

clearBtn.addEventListener("click", clearField); // Очистка поля рисования

happyBtn.addEventListener("click", () => {
  happyCount += 1; // Увеличение счетчика счастливых рисунков
  storeResult([1, 0, 0, 0]); // Сохранение текущего рисунка как счастливого
});

sadBtn.addEventListener("click", () => {
  sadCount += 1; // Увеличение счетчика грустных рисунков
  storeResult([0, 1, 0, 0]); // Сохранение текущего рисунка как грустного
});

angryBtn.addEventListener("click", () => {
  angryCount += 1; // Увеличение счетчика злых рисунков
  storeResult([0, 0, 1, 0]); // Сохранение текущего рисунка как злого
});

surprisedBtn.addEventListener("click", () => {
  surprisedCount += 1; // Увеличение счетчика удивленных рисунков
  storeResult([0, 0, 0, 1]); // Сохранение текущего рисунка как удивленного
});

predictBtn.addEventListener("click", () => {
  const inputTensor = preprocessDrawing(paintField); // Преобразование рисунка в тензор
  const prediction = model.predict(inputTensor); // Предсказание на основе входных данных
  const [happiness, sadness, anger, surprise] = prediction.dataSync(); // Получение результатов предсказания

  // Массив с названиями эмоций
  const emotions = ["счастливое", "грустное", "злое", "удивленное"];
  // Массив с результатами предсказания
  const scores = [happiness, sadness, anger, surprise];
  // Индекс максимального значения из результатов предсказания
  const maxIndex = scores.indexOf(Math.max(...scores));

  // Вывод сообщения с результатом предсказания
  alert(
    `Я думаю это ${emotions[maxIndex]} лицо!\nСчастье: ${Math.round(happiness * 100)}% Грусть: ${Math.round(sadness * 100)}% Злость: ${Math.round(anger * 100)}% Удивление: ${Math.round(surprise * 100)}%`
  );
});

trainBtn.addEventListener("click", () => {
  trainModel(trainData).then(() => {
    predictBtn.disabled = false; // Активация кнопки предсказания после обучения
    alert("Я обучился!"); // Вывод сообщения о завершении обучения
  });
});

// Инициализация интерфейса и canvas при загрузке страницы
updateInterface(); // Обновление интерфейса
clearCanvas(); // Очистка canvas и рисование сетки




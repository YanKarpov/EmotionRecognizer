// Получение элементов canvas и кнопок
const canvas = document.querySelector("#paintField"); // Элемент canvas, на котором происходит рисование
const clearBtn = document.querySelector("#clear"); // Кнопка для очистки поля
const sadBtn = document.querySelector("#sad"); // Кнопка для отметки грустного рисунка
const happyBtn = document.querySelector("#happy"); // Кнопка для отметки счастливого рисунка
const angryBtn = document.querySelector("#angry"); // Кнопка для отметки злого рисунка
const surprisedBtn = document.querySelector("#surprised"); // Кнопка для отметки удивленного рисунка
const trainBtn = document.querySelector("#train"); // Кнопка для запуска обучения нейронной сети
const predictBtn = document.querySelector("#predict"); // Кнопка для предсказания на основе текущего рисунка
const saveBtn = document.querySelector("#save"); // Кнопка для сохранения данных
const loadInput = document.querySelector("#load"); // Элемент input для загрузки данных

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
 * Обновляет текст кнопок для отображения текущего количества счастливых, грустных, злых и удивленных рисунков.
 */
function updateInterface() {
  happyBtn.innerText = `😀 ${happyCount}`; // Обновление текста кнопки happy
  sadBtn.innerText = `🙁 ${sadCount}`; // Обновление текста кнопки sad
  angryBtn.innerText = `😡 ${angryCount}`; // Обновление текста кнопки angry
  surprisedBtn.innerText = `😲 ${surprisedCount}`; // Обновление текста кнопки surprised
}

/**
 * Сохраняет текущее состояние рисунка и его метку в массив данных обучения.
 * @param {number[]} value - Метка рисунка (например, [1, 0, 0, 0] для счастливого, [0, 1, 0, 0] для грустного)
 */
function storeResult(value) {
  trainData.push({ paintField: [...paintField], label: value }); // Добавление данных в массив trainData
  if (value[0] === 1) happyCount++; // Увеличение счетчика счастливых рисунков
  else if (value[1] === 1) sadCount++; // Увеличение счетчика грустных рисунков
  else if (value[2] === 1) angryCount++; // Увеличение счетчика злых рисунков
  else if (value[3] === 1) surprisedCount++; // Увеличение счетчика удивленных рисунков
  updateInterface(); // Обновление интерфейса после добавления данных
  clearField(); // Очистка поля рисования
}

// Добавляем функцию для сохранения данных обучения в формате JSON
function saveTrainingData() {
  const jsonData = JSON.stringify(trainData); // Преобразуем массив trainData в JSON строку
  const blob = new Blob([jsonData], { type: 'application/json' }); // Создаем Blob из JSON строки
  const url = URL.createObjectURL(blob); // Создаем URL для скачивания Blob

  const a = document.createElement('a'); // Создаем элемент <a> для скачивания файла
  a.href = url; // Устанавливаем URL в атрибут href
  a.download = 'trainData.json'; // Устанавливаем имя файла для скачивания
  document.body.appendChild(a); // Добавляем элемент <a> на страницу
  a.click(); // Имитируем клик по элементу <a> для начала загрузки файла

  // Очищаем URL и удаляем элемент <a> после загрузки файла
  setTimeout(() => {
    URL.revokeObjectURL(url); // Освобождаем ресурсы URL
    document.body.removeChild(a); // Удаляем элемент <a> со страницы
    alert("Данные обучения сохранены в файл trainData.json!"); // Выводим сообщение об успешном сохранении
  }, 0);
}

// Добавляем функцию для загрузки данных обучения из файла JSON
function loadTrainingData(event) {
  const file = event.target.files[0]; 
  const reader = new FileReader(); 

  reader.onload = function (e) {
    const jsonData = e.target.result; // Получаем данные файла в виде текста
    const loadedData = JSON.parse(jsonData); // Преобразуем JSON строку в JavaScript объект
    trainData.push(...loadedData); // Добавляем загруженные данные в массив trainData
    
    // Обновляем счетчики эмоций в соответствии с загруженными данными
    loadedData.forEach(data => {
      if (data.label[0] === 1) happyCount++; // Увеличение счетчика счастливых рисунков
      if (data.label[1] === 1) sadCount++; // Увеличение счетчика грустных рисунков
      if (data.label[2] === 1) angryCount++; // Увеличение счетчика злых рисунков
      if (data.label[3] === 1) surprisedCount++; // Увеличение счетчика удивленных рисунков
    });
    
    updateInterface(); // Обновляем интерфейс после загрузки данных
    alert("Данные обучения загружены!"); // Выводим сообщение об успешной загрузке
  };

  reader.readAsText(file); // Читаем содержимое файла как текст
}

// Добавляем обработчик события для элемента input загрузки данных
loadInput.addEventListener('change', loadTrainingData);

// Добавление обработчиков событий для взаимодействия с мышью и кнопками
document.addEventListener("mousedown", () => (mouseDown = true)); // Нажатие кнопки мыши
document.addEventListener("mouseup", () => (mouseDown = false)); // Отпускание кнопки мыши

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) draw(e); // Вызов функции рисования при нажатой кнопке мыши
});

clearBtn.addEventListener("click", clearField); // Очистка поля рисования

happyBtn.addEventListener("click", () => {
  storeResult([1, 0, 0, 0]); // Сохранение текущего рисунка как счастливого
});

sadBtn.addEventListener("click", () => {
  storeResult([0, 1, 0, 0]); // Сохранение текущего рисунка как грустного
});

angryBtn.addEventListener("click", () => {
  storeResult([0, 0, 1, 0]); // Сохранение текущего рисунка как злого
});

surprisedBtn.addEventListener("click", () => {
  storeResult([0, 0, 0, 1]); // Сохранение текущего рисунка как удивленного
});

predictBtn.addEventListener("click", () => {
  const inputTensor = preprocessDrawing(paintField);
  const prediction = model.predict(inputTensor);
  const [happiness, sadness, anger, surprise] = prediction.dataSync();

  const emotions = ["счастливое", "грустное", "злое", "удивленное"];
  const scores = [happiness, sadness, anger, surprise];
  const maxIndex = scores.indexOf(Math.max(...scores));

  alert(
    `Я думаю это ${emotions[maxIndex]} лицо!\nСчастье: ${Math.round(happiness * 100)}% Грусть: ${Math.round(sadness * 100)}% Злость: ${Math.round(anger * 100)}% Удивление: ${Math.round(surprise * 100)}%`
  );
});

trainBtn.addEventListener("click", () => {
  trainModel(trainData).then(() => {
    predictBtn.disabled = false;
    alert("Я обучился!");
  });
});

saveBtn.addEventListener("click", saveTrainingData); // Сохранение данных обучения

// Начальная настройка интерфейса
updateInterface();
clearCanvas();
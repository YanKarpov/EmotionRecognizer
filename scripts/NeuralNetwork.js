/**
 * Создает нейронную сеть для распознавания эмоций на изображениях 10x10 пикселей.
 * Модель состоит из сверточного слоя, слоя максимального пулинга, слоя выравнивания и полносвязного слоя для классификации.
 */
const model = tf.sequential();

model.add(
  tf.layers.conv2d({
    inputShape: [10, 10, 1], // Входное изображение размером 10x10 пикселей с 1 каналом (оттенки серого)
    kernelSize: 3, // Размер фильтра сверточного слоя 3x3
    filters: 8, // Количество фильтров (выходных каналов) сверточного слоя
    activation: "relu", // Функция активации ReLU
  })
);
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] })); // Слой максимального пулинга с размером окна 2x2
model.add(tf.layers.flatten()); // Слой выравнивания для преобразования 2D матрицы в 1D вектор
model.add(tf.layers.dense({ units: 4, activation: "softmax" })); // Полносвязный слой с 4 нейронами для классификации (4 класса)

model.compile({
  optimizer: "adam", // Оптимизатор Adam
  loss: "categoricalCrossentropy", // Функция потерь categorical crossentropy для многоклассовой классификации
  metrics: ["accuracy"], // Метрика для оценки точности модели
});

/**
 * Преобразует рисунок, нарисованный на холсте, в 4D тензор для входа в нейронную сеть.
 * @param {boolean[]} paintField - Массив состояний ячеек поля рисования 10x10 (значения true/false).
 * @returns {tf.Tensor4D} 4D тензор с данными рисунка для входа в модель.
 */
function preprocessDrawing(paintField) {
  const tensor = tf.tensor4d(paintField, [1, 10, 10, 1]); // Преобразование массива в 4D тензор
  return tensor;
}

/**
 * Обучает нейронную сеть на предоставленных данных.
 * @param {Object[]} trainData - Массив объектов, содержащих данные рисунков и их метки.
 * @param {boolean[]} trainData[].paintField - Рисунок в виде массива состояний ячеек 10x10.
 * @param {number[]} trainData[].label - Метка класса (0, 1, 2 или 3).
 * @returns {Promise<void>} Promise, который завершается после завершения обучения модели.
 */
async function trainModel(trainData) {
  // Преобразование данных обучения в тензоры
  const xs = tf.concat(trainData.map((d) => preprocessDrawing(d.paintField))); // Конкатенация всех рисунков в один тензор
  const ys = tf.tensor2d(trainData.map((d) => d.label)); // Преобразование меток классов в 2D тензор

  // Обучение модели
  await model.fit(xs, ys, {
    epochs: 100, // Количество эпох обучения
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Эпоха ${epoch}: потеря = ${logs.loss.toFixed(4)}, точность = ${logs.acc.toFixed(4)}`); // Логирование результатов каждой эпохи
      },
    },
  });

  console.log("Обучение модели завершено");
}




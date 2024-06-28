/**
 * Создает нейронную сеть для распознавания эмоций на изображениях 10x10 пикселей.
 * Модель состоит из сверточного слоя, слоя максимального пулинга, слоя выравнивания и полносвязного слоя для классификации.
 */
const model = tf.sequential();
model.add(
  tf.layers.conv2d({
    inputShape: [10, 10, 1],
    kernelSize: 3,
    filters: 8,
    activation: "relu",
  })
);
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
model.add(tf.layers.flatten());
model.add(tf.layers.dense({ units: 2, activation: "softmax" }));

/**
 * Компилирует нейронную сеть с оптимизатором Adam, функцией потерь categoricalCrossentropy
 * и метриками accuracy для оценки производительности модели во время обучения.
 */
model.compile({
  optimizer: "adam",
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

/**
 * Преобразует рисунок, нарисованный на холсте, в 4D тензор для входа в нейронную сеть.
 * @param {number[][]} paintField - Массив пикселей рисунка 10x10 в оттенках серого.
 * @returns {tf.Tensor4D} 4D тензор с данными рисунка для входа в модель.
 */
function preprocessDrawing(paintField) {
  const tensor = tf.tensor4d(paintField, [1, 10, 10, 1]);
  return tensor;
}

/**
 * Обучает нейронную сеть на предоставленных данных.
 * @param {Object[]} trainData - Массив объектов, содержащих данные рисунков и их метки.
 * @param {number[][]} trainData[].paintField - Рисунок в виде массива пикселей 10x10.
 * @param {number[]} trainData[].label - Метка класса (0 или 1).
 * @returns {Promise<void>} Promice, который завершается после завершения обучения модели.
 */
async function trainModel(trainData) {
  const xs = tf.concat(trainData.map((d) => preprocessDrawing(d.paintField)));
  const ys = tf.tensor2d(trainData.map((d) => d.label));

  await model.fit(xs, ys, {
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(
          `Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`
        );
      },
    },
  });

  console.log("Model training complete");
}


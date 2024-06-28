// Создание модели нейронной сети
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

// Компиляция модели
model.compile({
  optimizer: "adam",
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

// Функция для преобразования рисунка в тензор
function preprocessDrawing(paintField) {
  const tensor = tf.tensor4d(paintField, [1, 10, 10, 1]); // Преобразование в 4D тензор
  return tensor;
}

// Функция для обучения модели
async function trainModel(trainData) {
  const xs = tf.concat(trainData.map((d) => preprocessDrawing(d.paintField)));
  const ys = tf.tensor2d(trainData.map((d) => d.label));

  await model.fit(xs, ys, {
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(
          `Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.acc}`
        );
      },
    },
  });

  console.log("Model training complete");
}

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
model.add(tf.layers.dense({ units: 4, activation: "softmax" })); // Изменено на 4 нейрона для 4 классов

model.compile({
  optimizer: "adam",
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

function preprocessDrawing(paintField) {
  const tensor = tf.tensor4d(paintField, [1, 10, 10, 1]);
  return tensor;
}

async function trainModel(trainData) {
  const xs = tf.concat(trainData.map((d) => preprocessDrawing(d.paintField)));
  const ys = tf.tensor2d(trainData.map((d) => d.label));

  await model.fit(xs, ys, {
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Эпоха ${epoch}: потеря = ${logs.loss.toFixed(4)}, точность = ${logs.acc.toFixed(4)}`);
      },
    },
  });

  console.log("Обучение модели завершено");
}



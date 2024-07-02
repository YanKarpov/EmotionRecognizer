const lossCtx = document.getElementById('lossChart').getContext('2d');
const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');

const lossChart = new Chart(lossCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Training Loss',
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      data: [],
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Epoch'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Loss'
        }
      }
    }
  }
});

const accuracyChart = new Chart(accuracyCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Training Accuracy',
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      data: [],
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Epoch'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Accuracy'
        }
      }
    }
  }
});

// Обработчик событий для получения данных от основного скрипта
window.addEventListener('message', event => {
  const { epoch, loss, accuracy } = event.data;
  
  // Обновление графика потерь
  lossChart.data.labels.push(epoch + 1);
  lossChart.data.datasets[0].data.push(loss);
  lossChart.update();

  // Обновление графика точности
  accuracyChart.data.labels.push(epoch + 1);
  accuracyChart.data.datasets[0].data.push(accuracy);
  accuracyChart.update();
});

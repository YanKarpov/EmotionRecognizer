const ctx = document.getElementById('combinedChart').getContext('2d');

const combinedChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Потеря при обучении',
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        data: [],
        yAxisID: 'lossAxis',
      },
      {
        label: 'Точность при обучении',
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        data: [],
        yAxisID: 'accuracyAxis',
      }
    ]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Эпоха'
        }
      },
      lossAxis: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Потеря'
        }
      },
      accuracyAxis: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Точность'
        },
        grid: {
          drawOnChartArea: false, // Disable grid lines for the accuracy axis to avoid overlap
        }
      }
    }
  }
});

// Обработчик событий для получения данных от основного скрипта
window.addEventListener('message', event => {
  const { epoch, loss, accuracy } = event.data;
  
  // Обновление графика
  combinedChart.data.labels.push(epoch + 1);
  combinedChart.data.datasets[0].data.push(loss);
  combinedChart.data.datasets[1].data.push(accuracy);
  combinedChart.update();
});

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ todos }) => {
  // Calculate counts for each status
  const statusCounts = todos.reduce((acc, todo) => {
    acc[todo.status] = (acc[todo.status] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the chart
  const data = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          statusCounts.pending || 0,
          statusCounts.in_progress || 0,
          statusCounts.completed || 0,
        ],
        backgroundColor: [
          '#ffd43b', // Yellow for Pending
          '#228be6', // Blue for In Progress
          '#40c057', // Green for Completed
        ],
        borderColor: [
          '#f8f9fa',
          '#f8f9fa',
          '#f8f9fa',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
  };

  return (
    <div className="chart-container" style={{ height: '300px', marginBottom: '20px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ProgressChart;

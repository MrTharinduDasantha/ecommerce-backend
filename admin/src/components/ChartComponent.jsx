import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';
import '../../utils/chartConfig'; // Import chart config to register elements

const ChartComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get the 2D context of the canvas
    const ctx = canvasRef.current.getContext('2d');
    
    // Example data for a bar chart
    const chartData = {
      labels: ['January', 'February', 'March', 'April'],
      datasets: [
        {
          label: 'My Dataset',
          data: [65, 59, 80, 81],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: true,
        },
      ],
    };

    // Example chart options
    const chartOptions = {
      responsive: true,
      plugins: {
        filler: {
          propagate: true,
        },
      },
    };

    // Create the Chart instance
    const chartInstance = new Chart(ctx, {
      type: 'bar', // Type of chart: 'bar', 'line', 'pie', etc.
      data: chartData,
      options: chartOptions,
    });

    // Cleanup to destroy chart on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ChartComponent;

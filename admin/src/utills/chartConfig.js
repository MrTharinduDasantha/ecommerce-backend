import { Chart, registerables } from 'chart.js';
import { Filler, ArcElement, BarElement } from 'chart.js';

// Register all the necessary chart types and plugins
Chart.register(...registerables, Filler, ArcElement, BarElement);

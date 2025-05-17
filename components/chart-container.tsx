"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartContainerProps {
  type: 'line' | 'bar';
  data: ChartData<any>;
  options?: ChartOptions<any>;
  title: string;
  subtitle?: string;
  height?: string;
}

export function ChartContainer({
  type,
  data,
  options,
  title,
  subtitle,
  height = '300px'
}: ChartContainerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Default chart options with styling
  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        borderWidth: 2,
        hoverBorderWidth: 3,
        backgroundColor: isDark 
          ? 'rgba(255, 255, 255, 0.9)' 
          : 'rgba(255, 255, 255, 1)',
        borderColor: isDark 
          ? 'rgba(138, 75, 255, 1)' 
          : 'rgba(79, 70, 229, 1)',
      },
      line: {
        tension: 0.3,
        borderWidth: 3,
        borderCapStyle: 'round',
        fill: true,
      },
      bar: {
        borderWidth: 0,
        borderRadius: 6,
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: isDark 
          ? 'rgba(20, 20, 25, 0.9)' 
          : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          family: 'Inter, sans-serif',
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        caretSize: 6,
        boxPadding: 4,
        borderColor: isDark 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark 
            ? 'rgba(255, 255, 255, 0.6)' 
            : 'rgba(0, 0, 0, 0.6)',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: isDark 
            ? 'rgba(255, 255, 255, 0.6)' 
            : 'rgba(0, 0, 0, 0.6)',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          padding: 10,
        },
        border: {
          display: false,
        },
      },
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card p-5 shadow-lg h-full"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ height }} className="relative">
        {/* Background overlay for 3D depth effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-transparent rounded-lg pointer-events-none z-10" />
        
        {type === 'line' && (
          <Line data={data} options={mergedOptions} />
        )}
        
        {type === 'bar' && (
          <Bar data={data} options={mergedOptions} />
        )}
      </div>
    </motion.div>
  );
}
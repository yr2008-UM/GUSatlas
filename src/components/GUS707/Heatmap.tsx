'use client';
import dynamic from 'next/dynamic';
import { Box } from '@mui/joy';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface HeatmapProps {
  data: {
    [key: string]: string;
  }[];
}

export default function Heatmap({ data }: HeatmapProps) {
  if (!data || data.length === 0) return null;

  // Extract IDs and other columns
  const ids = data.map(row => row.ID);
  const columns = Object.keys(data[0]).filter(key => key !== 'ID');
  
  // Create z-values matrix
  const zValues = data.map(row => 
    columns.map(col => parseFloat(row[col]) || 0)
  );

  const plotData = [{
    type: 'heatmap',
    z: zValues,
    x: columns,
    y: ids,
    hoverongaps: false,
    colorscale: [
      [0, 'rgb(0, 0, 255)'],     // 蓝色
      [0.5, 'rgb(255, 255, 255)'], // 白色
      [1, 'rgb(255, 0, 0)']      // 红色
    ],
    showscale: true,
    colorbar: {
      title: 'Value',
      titleside: 'right',
      thickness: 20,
    }
  }];

  const layout = {
    title: 'GUS707 Data Heatmap',
    height: Math.max(500, data.length * 20), // Dynamic height based on number of rows
    width: Math.max(800, columns.length * 50), // Dynamic width based on number of columns
    yaxis: {
      title: 'ID',
      tickangle: 0
    },
    margin: {
      l: 150, // Increase left margin for ID labels
      r: 80, // 增加右边距以适应色标
      b: 100,
      t: 50,
      pad: 4
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      overflowX: 'auto',
      mt: 2 
    }}>
      <Plot
        data={plotData as any}
        layout={layout as any}
        config={{ responsive: true }}
      />
    </Box>
  );
}

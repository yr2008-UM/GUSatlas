'use client';
import { Table, Typography, Sheet, useColorScheme } from '@mui/joy';
import { downloadData } from '@/data/downloadData';

export default function Download() {
  const { mode } = useColorScheme();
  
  const handleDownload = async (filename: string) => {
    try {
      const response = await fetch(`/api/download?filename=${encodeURIComponent(filename)}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen">
      <Sheet
        sx={{
          p: 4,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <Typography level="h1" sx={{ mb: 4 }}>Download</Typography>
        <Sheet
          variant="outlined"
          sx={{
            borderRadius: 'sm',
            overflow: 'auto',
            backgroundColor: mode === 'light' ? '#ffffff' : 'var(--joy-palette-background-surface)',
          }}
        >
          <Table
            borderAxis="both"
            size="md"
            stickyHeader
            hoverRow
            sx={{
              '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
              '--Table-headerUnderlineThickness': '1px',
              '--TableRow-hoverBackground': () =>
                mode === 'dark'
                  ? 'var(--joy-palette-background-level2)'
                  : 'var(--joy-palette-background-level1)',
              '--TableCell-borderColor': () =>
                mode === 'dark'
                  ? 'var(--joy-palette-neutral-800)'
                  : 'var(--joy-palette-neutral-200)',
              'thead th:first-child': { width: '100px' },
              'thead th:nth-child(2)': { width: '60%' },
              'thead th:nth-child(3)': { width: '100px' },
              'thead th:last-child': { width: '120px' },
            }}
          >
            <thead>
              <tr>
                <th>File</th>
                <th>Description</th>
                <th>File size</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {downloadData.map((item) => (
                <tr key={item.file}>
                  <td>
                    <Typography level="body-sm">{item.file}</Typography>
                  </td>
                  <td>
                    <Typography
                      level="body-sm"
                      sx={{ whiteSpace: 'pre-line' }}
                    >
                      {item.description}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">{item.size}</Typography>
                  </td>
                  <td>
                    <Typography
                      level="body-sm"
                      component="a"
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.500',
                        '&:hover': {
                          textDecoration: 'underline',
                        }
                      }}
                      onClick={() => handleDownload(item.downloadLink)}
                    >
                      {item.downloadLink}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </Sheet>
    </div>
  );
}

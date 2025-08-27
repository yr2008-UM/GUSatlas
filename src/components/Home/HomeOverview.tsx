import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import DatasetIcon from '@mui/icons-material/Dataset';
import CategoryIcon from '@mui/icons-material/Category';
import PublicIcon from '@mui/icons-material/Public';

const statistics = [
  {
    icon: <DatasetIcon sx={{ fontSize: 40, color: '#CDA3FF' }} />,
    title: '168,464 samples',
    subtitle: '482 projects',
  },
  {
    icon: <CategoryIcon sx={{ fontSize: 40, color: '#CDA3FF' }} />,
    title: '212 classes',
    subtitle: '93 phyla',
  },
  {
    icon: <PublicIcon sx={{ fontSize: 40, color: '#CDA3FF' }} />,
    title: '65 countries',
    subtitle: '8 regions',
  },
];

export const HomeOverview = () => {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        backgroundColor: '#121A2E',
        color: '#E3E7ED',
      }}
    >
      <Typography
        level="h2"
        sx={{
          textAlign: 'center',
          mb: 4,
          color: '#E3E7ED',
        }}
      >
        OVERVIEW
      </Typography>
      <Grid container spacing={2} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {statistics.map((stat, index) => (
          <Grid key={index} xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#E3E7ED',
              }}
            >
              {stat.icon}
              <Typography level="h4" sx={{ mt: 2, color: '#E3E7ED' }}>
                {stat.title}
              </Typography>
              <Typography sx={{ color: '#E3E7ED' }}>
                {stat.subtitle}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

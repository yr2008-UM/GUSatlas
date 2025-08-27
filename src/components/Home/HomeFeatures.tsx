import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';

const features = [
  {
    title: 'Browsing',
    description: 'Explore, select, filter, and visualize the GUSatlas we have created.',
  },
  {
    title: 'Alignment',
    description: 'Blast against our GUS collections, including GUS550, GUS707, and GUSref1144.',
  },
  {
    title: 'Identification',
    description: 'Identify gmGUSs from the uploaded amino acid sequences.',
  },
  {
    title: 'Classification',
    description: 'Categorize the loop category of the input amino acid sequences.',
  },
];

export const HomeFeatures = () => {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        backgroundColor: '#FFF0F5',
      }}
    >
      <Typography
        level="h2"
        sx={{
          textAlign: 'center',
          mb: 4,
          color: 'purple',
        }}
      >
        HOW TO USE GUSATLAS?
      </Typography>
      <Grid container spacing={2} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {features.map((feature, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
              }}
            >
              <Typography level="h4" sx={{ mb: 2 }}>
                {feature.title}
              </Typography>
              <Typography sx={{ mb: 2, flex: 1 }}>
                {feature.description}
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'blue',
                  color: 'blue',
                  '&:hover': {
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.04)',
                  },
                }}
              >
                Ready For Use
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

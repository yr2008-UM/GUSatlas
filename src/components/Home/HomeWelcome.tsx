import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Image from 'next/image';

export const HomeWelcome = () => {
  return (
    <Box
      sx={{
        py: 4,
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Welcome Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Typography
          level="h1"
          sx={{
            color: '#666',
            fontSize: '2.5rem',
            mb: 2,
          }}
        >
          Welcome to GUSatlas!
        </Typography>
        <Typography
          level="h2"
          sx={{
            color: '#666',
            fontSize: '1.8rem',
          }}
        >
          A Database for Browsing and Analyzing beta-Glucuronidases!
        </Typography>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          display: 'flex',
          maxWidth: 1200,
          mx: 'auto',
          px: 2,
          gap: 4,
          alignItems: 'center',
        }}
      >
        {/* Left Side - Image */}
        <Box
          sx={{
            flex: '0 0 400px',
            height: 400,
            position: 'relative',
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/protein-structure.png"
            alt="Protein Structure"
            width={400}
            height={400}
            unoptimized
            style={{ 
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </Box>

        {/* Right Side - Text Content */}
        <Box sx={{ flex: 1 }}>
          <Typography
            level="h2"
            sx={{
              color: 'purple',
              mb: 2,
              fontSize: '2rem',
            }}
          >
            What is GUS?
          </Typography>
          <Typography
            sx={{
              color: '#333',
              lineHeight: 1.6,
              fontSize: '1rem',
            }}
          >
            Gut microbial β-glucuronidases (gmGUSs, E.C. 3.2.1.31) are enzymes from the glycoside hydrolase (GH) family (GH family 2 in majority and GH family 30 and 79 the minority) that catalyze the hydrolysis of glucuronidated conjugates of endogenous or exogenous compounds to release the aglycone. The deconjugation reaction reverses host UGTs-mediated glucuronidation process, facilitates the reabsorption and enterohepatic circulation. The liver UGTs-gmGUSs axis works coordinately to maintain the glucuronidation homeostasis and determine the circulating level and local intestinal exposure of the parent compounds and their metabolites.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

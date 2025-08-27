import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: '#ffffff',
          surface: '#ffffff',
        },
        text: {
          primary: '#000000',
          secondary: '#374151',
        },
        neutral: {
          outlinedBorder: '#E5E7EB',
          solidBg: '#ffffff',
        },
      },
    },
  },
});

export default theme;

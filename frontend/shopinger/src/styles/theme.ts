import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffc107', // A vibrant yellow
    },
    secondary: {
      main: '#212121', // A dark grey, almost black
    },
    error: {
      main: '#d32f2f', // Standard red for errors
    },
    background: {
      default: '#ffffff', // White background
      paper: '#f5f5f5',   // A very light grey for paper elements
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    }
  },
});

export default theme;
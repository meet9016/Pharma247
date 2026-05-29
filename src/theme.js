import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f6212', // Default border
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f6212', // Hover border
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f6212', // Focused border
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#3f6212', // Default label
          '&.Mui-focused': {
            color: '#3f6212', // Focused label
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottom: '2px solid #3f6212',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #3f6212',
          },
          '&:after': {
            borderBottom: '2px solid #3f6212',
          },
        },
      },
    },
  },
  palette: {
    primary: { main: '#3f6212' },
    secondary: { main: '#F31C1C' },
  },
});

export default theme;

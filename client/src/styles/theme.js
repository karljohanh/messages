import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#3f3434',
      light: '#eeeeee',
      dark: '#393939',
      contrastText: '#fff',
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;

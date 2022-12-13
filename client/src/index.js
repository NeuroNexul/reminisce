import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import App from './App';
import chalk from 'chalk';
import GlobalStyle from './components/utils/globalStyle';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GlobalStyles } from "@mui/material";
import AuthContextProvider from './components/auth/authContext';
import GlobalContextProvider from './globalContext';
import SocketProvider from './socket';
export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

function RenderApp(props) {

      /**
       * Get the current color mode from the browser's local storage and the default system theme.
       */
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      const themeAdded = window.localStorage.getItem('theme');

      /**
       * If there is no theme in local storage, set the default theme to the browser's system theme.
       */
      var detectedTheme = darkThemeMq.matches ? 'dark' : 'light';
      if (themeAdded) {
            if (themeAdded === 'dark') {
                  detectedTheme = 'dark';
            } else if (themeAdded === 'light') {
                  detectedTheme = 'light';
            } else if (themeAdded === 'auto') {
                  detectedTheme = detectedTheme;
            }
      }

      /**
       * Store all values to state
       */
      const [mode, setMode] = React.useState(detectedTheme);
      const [userTheme, setUserTheme] = React.useState(themeAdded ?? 'auto');

      /**
       * Reset theme whenever the theme changes.
       */
      darkThemeMq.addListener(e => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));

            if (e.matches) {
                  window.localStorage.setItem('theme', 'dark');
            } else {
                  window.localStorage.setItem('theme', 'light');
            }
      });

      /**
       * Set the theme to the user's preference.
       */
      const colorMode = React.useMemo(
            () => ({
                  toggleColorMode: (modeString) => {
                        if (modeString && typeof modeString === 'string') {
                              console.log(chalk.greenBright('theme set to: ', modeString));
                              setUserTheme(modeString);
                              window.localStorage.setItem('theme', modeString);
                        } else {
                              setUserTheme((prevMode) => {
                                    if (prevMode === 'light') {
                                          console.log(chalk.greenBright('theme set to: dark'));
                                          window.localStorage.setItem('theme', 'dark');
                                          return 'dark';
                                    }
                                    else if (prevMode === 'dark') {
                                          console.log(chalk.greenBright('theme set to: auto'));
                                          window.localStorage.setItem('theme', 'auto');
                                          return 'auto';
                                    }
                                    else if (prevMode === 'auto') {
                                          console.log(chalk.greenBright('theme set to: light'));
                                          window.localStorage.setItem('theme', 'light');
                                          return 'light';
                                    }
                              });
                        }
                  },
                  mode: mode,
                  userTheme: userTheme
            }),
            [mode, userTheme],
      );

      /**
       * Set the theme according to the theme selected by the user or the default system theme.
       */
      React.useEffect(() => {
            if (userTheme === 'auto') {
                  setMode(detectedTheme);
            } else {
                  setMode(userTheme);
            }
      }, [userTheme]);

      /**
       * Create the theme.
       */
      const theme = React.useMemo(
            () =>
                  createTheme({
                        palette: {
                              mode,
                              ...(mode === 'dark' ? {
                                    background: {
                                          default: '#36393f',
                                          paper: '#36393f',
                                          primary: '#36393f',
                                          secondary: '#232428',
                                    },
                                    text: {
                                          primary: '#ffffff',
                                          secondary: '#ffffffb3',
                                    },
                                    scrollbar: {
                                          thumb: '#202225',
                                          track: '#0e0f11',
                                    },
                              } : {
                                    background: {
                                          default: '#ffffff',
                                          paper: '#ffffff',
                                          primary: '#ffffff',
                                          secondary: '#c2c2c2',
                                    },
                                    text: {
                                          primary: '#000000',
                                          secondary: '#00000099',
                                    },
                                    scrollbar: {
                                          thumb: '#909090',
                                          track: '#cccccc',
                                    },
                              })
                        },
                  }),
            [mode],
      );

      /**
       * Apply all context and render the app.
       */
      return (
            <ColorModeContext.Provider value={colorMode}>
                  <ThemeProvider theme={theme}>
                        <AuthContextProvider>
                              <GlobalStyles styles={(theme) => ({
                                    '*': {
                                          // transition: 'color, background-color 0.3s ease-in-out',
                                    }
                              })} />
                              <GlobalStyle />
                              <App {...props} />
                        </AuthContextProvider>
                  </ThemeProvider>
            </ColorModeContext.Provider>
      );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      // <React.StrictMode>
      <BrowserRouter>
            <GlobalContextProvider>
                  <SocketProvider>
                        <RenderApp />
                  </SocketProvider>
            </GlobalContextProvider>
      </BrowserRouter>
      // </React.StrictMode>
);
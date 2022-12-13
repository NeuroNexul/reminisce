import React from 'react'

// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import Collapse from '@mui/material/Collapse';
import { SnackbarProvider } from 'notistack';

export const GlobalContext = React.createContext({
      showSnackBar: () => { },
});

export default function GlobalContextProvider(props) {

      // const { enqueueSnackbar } = useSnackbar();
      const snackBarRef = React.useRef();

      const showSnackBar = (message, options) => {

            const transitions = {
                  slideLeft: (props) => <Slide {...props} direction="left" />,
                  slideRight: (props) => <Slide {...props} direction="right" />,
                  slideUp: (props) => <Slide {...props} direction="up" />,
                  slideDown: (props) => <Slide {...props} direction="down" />,
                  fade: (props) => <Fade {...props} />,
                  grow: (props) => <Grow {...props} />,
                  zoom: (props) => <Zoom {...props} />,
                  collapse: (props) => <Collapse {...props} />,
            };

            snackBarRef.current.enqueueSnackbar(message, {
                  variant: 'default',
                  anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                  },
                  autoHideDuration: 3000,
                  TransitionComponent: transitions[options?.transition] ?? Slide,

                  ...options,
            });
      }

      return (
            <GlobalContext.Provider value={{
                  showSnackBar,
            }}>
                  <SnackbarProvider ref={snackBarRef} maxSnack={4}>

                        {props.children}

                  </SnackbarProvider>
            </GlobalContext.Provider>
      )
}

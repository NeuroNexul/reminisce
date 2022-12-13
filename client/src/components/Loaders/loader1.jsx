import React from 'react'
import style from './loader1.module.scss';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';

const Bar = styled('div')(({ theme }) => ({
      backgroundColor: theme.palette.mode === "light" ? theme.palette.primary.main : "#fff",
}))

const Ball = styled('div')(({ theme }) => ({
      backgroundColor: theme.palette.mode === "light" ? theme.palette.primary.main : "#fff",
}))

export default function Loader1(props) {

      const [snackBar, setSnackBar] = React.useState({
            type: 'success',
            isOpen: false,
            message: '',
            transition: (props) => <Slide {...props} direction="right" />,
            onClose: (event, reason) => {
                  if (reason === 'clickaway') {
                        return;
                  }
                  setSnackBar({ ...snackBar, isOpen: false })
            }
      });

      const showSnackBar = (error) => {
            setSnackBar({
                  ...snackBar,
                  type: 'error',
                  message: error,
                  isOpen: true,
            });
      }

      const Alert = React.forwardRef(function Alert(props, ref) {
            return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

      React.useEffect(() => {
            setTimeout(() => {
                  setSnackBar({
                        ...snackBar,
                        type: 'error',
                        isOpen: true,
                        message: 'It seems that your network connection is not stable. Please try again later.',
                  })
            }, 1000 * 15);
      }, []);

      return (
            <Box className={style.container} sx={{
                  bgcolor: 'background.default',
                  color: 'text.primary',
                  width: '100%',
                  height: '100%',
                  position: "relative",
                  top: 0,
                  left: 0,
            }}>
                  <div className={style.loader}>
                        <Bar className={style.loader__bar}></Bar>
                        <Bar className={style.loader__bar}></Bar>
                        <Bar className={style.loader__bar}></Bar>
                        <Bar className={style.loader__bar}></Bar>
                        <Bar className={style.loader__bar}></Bar>
                        <Ball className={style.loader__ball}></Ball>
                  </div>

                  <Snackbar
                        open={snackBar.isOpen}
                        onClose={snackBar.onClose}
                        TransitionComponent={snackBar.transition}
                        key={snackBar.transition ? snackBar.transition.name : ''}
                        autoHideDuration={6000}
                  >
                        <Alert onClose={snackBar.onClose} severity={snackBar.type} sx={{ width: '100%' }}>
                              {snackBar.message}
                        </Alert>
                  </Snackbar>
            </Box>
      )
}

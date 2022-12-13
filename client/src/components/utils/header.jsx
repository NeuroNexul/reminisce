import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

import { ColorModeContext } from '../..';
import { AuthContext } from '../auth/authContext';

import { useTheme, styled } from '@mui/material/styles';
import { Box, Typography, Drawer, Button, ButtonGroup, Divider, ToggleButtonGroup, ToggleButton, IconButton, Avatar, Chip, TextareaAutosize, Stack } from '@mui/material';

// Icons
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import CloseIcon from '@mui/icons-material/Close';
import { G_Icon } from './icons';
import { GlobalContext } from '../../globalContext';

const Heading = styled(Typography)(({ theme }) => ({
      margin: '1rem 0 .25rem',
      color: theme.palette.grey[600],
      fontWeight: 700,
      fontSize: theme.typography.pxToRem(11),
      textTransform: 'uppercase',
      letterSpacing: '.08rem',
}));

const IconToggleButton = styled(ToggleButton)({
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      '& > *': {
            marginRight: '8px',
      },
});

export default function Header(Props) {

      const auth = React.useContext(AuthContext);

      const [sideBarState, setSideBarState] = React.useState({
            isOpen: false
      });
      const toggleDrawer = (anchor, open) => (event) => {
            if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                  return;
            }

            setSideBarState({ ...sideBarState, isOpen: open });
      };

      return (
            <Box
                  sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                        py: '.25rem',
                        '*': {
                              whiteSpace: 'nowrap',
                        }
                  }}
            >
                  <Link to={'/'} style={{ textDecoration: 'none' }}><Typography variant='h5' sx={{
                        fontWeight: '800',
                        mx: '1rem',
                        color: 'text.primary',
                        textDecoration: 'none',
                  }}>Reminisce</Typography></Link>

                  {auth.isAuthenticated && !window.location.pathname.includes('/dashboard') && (
                        <Link to={'/dashboard'} style={{ textDecoration: 'none' }}><Typography variant='h6' sx={{
                              fontWeight: '800',
                              fontSize: '14px',
                              mx: '1rem',
                              color: 'text.primary',
                              textDecoration: 'none',
                              '&:hover': {
                                    textDecoration: 'underline',
                              },
                        }}>Go to Dashboard</Typography></Link>
                  )}

                  <Box sx={{
                        flexGrow: 1,
                        maxWidth: '100%',
                        overflow: 'auto',
                  }}>
                        {Props.navContent}
                  </Box>

                  <Button onClick={toggleDrawer("right", true)} sx={{
                        ml: 'auto',
                        mr: '.25rem'
                  }}>
                        <Chip
                              avatar={<Avatar alt={auth.isAuthenticated ? auth.user.name : "Google"} src={auth.isAuthenticated ? auth.user.avatar : ""} imgProps={{
                                    referrerPolicy: 'no-referrer',
                              }} />}
                              label={auth.isAuthenticated ? auth.user.name : 'Login / Register'}
                              variant="outlined"
                              color="primary"
                              sx={{
                                    cursor: 'pointer',
                                    fontWeight: '600',
                              }}
                        />
                  </Button>
                  <Drawer
                        anchor="right"
                        open={sideBarState.isOpen}
                        onClose={toggleDrawer("right", false)}
                        BackdropProps={{
                              invisible: false,
                        }}
                        SlideProps={{
                              sx: {
                                    backgroundColor: 'background.default !important',
                                    backgroundImage: 'none !important',
                                    borderRadius: '15px 0 0 15px',
                                    width: '100%',
                                    maxWidth: '400px',
                              }
                        }}
                  >
                        <SideBar onClose={toggleDrawer("right", false)} extraContent={Props.sideBarContent} />
                  </Drawer>
            </Box>
      )
}

const SideBar = (Props) => {

      const theme = useTheme();
      const colorMode = React.useContext(ColorModeContext);
      const auth = React.useContext(AuthContext);
      const globalContext = React.useContext(GlobalContext);

      return (
            <Box
                  sx={{
                        minHeight: '100%',
                        height: 'auto',
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: 'background.default',
                        color: 'text.primary',
                        padding: '1rem',
                  }}
            >
                  {/* Top Header */}
                  <Box
                        sx={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                        }}
                  >
                        <Typography
                              variant="h6"
                              sx={{
                                    fontWeight: '500',
                                    fontSize: '1.1rem',
                              }}
                        >Profile</Typography>
                        <IconButton
                              onClick={Props.onClose}
                              sx={{
                                    ml: 'auto',

                              }}
                        >
                              <CloseIcon />
                        </IconButton>
                  </Box>
                  <Divider />

                  {/* Body */}
                  <Box sx={{
                        py: '1rem',
                  }}>

                        {/* Profile */}

                        <Box sx={{
                              pb: '1rem',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                        }}>
                              {auth.isAuthenticated ?
                                    <>
                                          <Avatar
                                                alt={auth.user.name}
                                                src={auth.user.avatar}
                                                sx={{ width: 128, height: 128 }}
                                          />
                                          <Typography variant='h6' sx={{
                                                fontWeight: '500',
                                                fontSize: '1.5rem',
                                          }}>{auth.user.name}</Typography>
                                          <Typography variant='h6' sx={{
                                                fontWeight: '500',
                                                fontSize: '.75rem',
                                                color: 'text.secondary',
                                                // mb: '.5rem',
                                          }}>{auth.user.email}</Typography>

                                          <Stack direction="row" spacing={1} sx={{
                                                my: '.5rem',
                                          }}>
                                                <Chip
                                                      label={'Total Documents: ' + auth.user?.documents?.length}
                                                      color='success'
                                                      variant='outlined'
                                                />
                                                <Chip
                                                      label={'Total Commits: ' + (function () {
                                                            let count = 0;
                                                            auth.user.documents.forEach(doc => {
                                                                  count += doc.commits.length;
                                                            });
                                                            return count;
                                                      })()}
                                                      color='success'
                                                      variant='outlined'
                                                />
                                          </Stack>

                                          <TextareaAutosize
                                                aria-label="About Yourself"
                                                placeholder='About Yourself'
                                                maxLength={400}
                                                style={{
                                                      maxWidth: '100%',
                                                      width: '300px',
                                                      padding: '.5rem',
                                                      borderRadius: '5px',
                                                      outline: 'none',
                                                      border: '1px solid',
                                                      borderColor: theme.palette.grey[300],
                                                      backgroundColor: theme.palette.background.paper,
                                                      color: theme.palette.text.primary,
                                                      resize: 'none',
                                                      fontFamily: theme.typography.fontFamily,
                                                      marginBottom: '.5rem',
                                                }}
                                                value={auth.user.bio}
                                                onChange={(e) => {
                                                      var about = e.target.value;

                                                      if (about.length <= 300) {
                                                            auth.setBio(about);
                                                      } else {
                                                            auth.setBio(about.substring(0, 300));
                                                      }
                                                }}
                                                onBlur={async (e) => {
                                                      try {
                                                            var about = e.target.value;

                                                            if (about.length < 300) {
                                                                  const res = await axios.post('/api/auth/setAbout', { about });
                                                                  if (res.status === 200) {
                                                                        auth.setBio(res.data.data.bio);
                                                                        globalContext.showSnackBar(res.data.message, {
                                                                              variant: 'success',
                                                                              transition: 'slideRight',
                                                                        });
                                                                  }
                                                            } else {
                                                                  about = about.substring(0, 300);
                                                                  const res = await axios.post('/api/auth/setAbout', { about });
                                                                  if (res.status === 200) {
                                                                        auth.setBio(res.data.data.bio);
                                                                        globalContext.showSnackBar(res.data.message, {
                                                                              variant: 'success',
                                                                              transition: 'slideRight',
                                                                        });
                                                                  }
                                                            }

                                                      } catch (err) {
                                                            console.log(err);

                                                            globalContext.showSnackBar(err.message, {
                                                                  variant: 'error',
                                                                  transition: 'slideRight',
                                                            });
                                                      }
                                                }}
                                          />

                                          <GoogleButton isDisabled={false} onClick={auth.logout} text="Logout" />
                                    </>
                                    :
                                    <>
                                          <GoogleButton isDisabled={auth.isLoginDisabled} onClick={auth.login} text="Login With Google" />
                                    </>
                              }

                        </Box>

                        <Divider />

                        {/* Settings */}
                        <Box>

                              {/* Theme */}
                              <Heading gutterBottom>
                                    Theme
                              </Heading>
                              <ToggleButtonGroup
                                    exclusive
                                    value={colorMode.userTheme}
                                    color="primary"
                                    onChange={(e, value) => {
                                          if (value === null) return;
                                          colorMode.toggleColorMode(value);
                                    }}
                                    fullWidth
                              >
                                    <IconToggleButton value="light" aria-label="Light">
                                          <LightModeIcon fontSize="small" />
                                          Light
                                    </IconToggleButton>
                                    <IconToggleButton value="auto" aria-label="System">
                                          <SettingsBrightnessIcon fontSize="small" />
                                          System
                                    </IconToggleButton>
                                    <IconToggleButton value="dark" aria-label="Dark">
                                          <DarkModeOutlinedIcon fontSize="small" />
                                          Dark
                                    </IconToggleButton>
                              </ToggleButtonGroup>
                        </Box>

                        {Props.extraContent}
                  </Box>
            </Box>
      );
}

const GoogleButton = Props => {

      return (
            <Button sx={{
                  bgcolor: '#4285f4',
                  height: '43px',
                  p: '0',
                  border: '2px solid transparent',
                  '&:hover': {
                        bgcolor: '#3c78d8',
                  },
                  '&:disabled': {
                        opacity: 0.6
                  },
            }} disabled={Props.isDisabled} onClick={Props.onClick}>
                  <Box fullWidth sx={{
                        height: '39px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                  }}>
                        <Box sx={{
                              height: '39px',
                              width: '39px',
                              backgroundColor: "#fff",
                              borderRadius: "4px"
                        }}>
                              <G_Icon style={{
                                    height: '39px',
                                    width: '39px',
                              }} />
                        </Box>
                        <Box sx={{
                              flexGrow: '1',
                              display: 'grid',
                              placeItems: 'center',
                              p: '2px',
                              px: '8px',
                        }}>
                              <Typography variant='h6' sx={{
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    color: '#fff',
                              }}>
                                    {Props.text}
                              </Typography>
                        </Box>
                  </Box>
            </Button>
      )
}

import React from 'react'
import { useMatch, useNavigate } from "react-router-dom"
import { AuthContext } from '../../auth/authContext';
import RichEditor from '../../editor/editor';
import Header from '../../utils/header';
import DocumentSizeList from './documentSize';
import axios from 'axios';

import {
      Avatar,
      Backdrop,
      Box,
      Button,
      Chip,
      CircularProgress,
      circularProgressClasses,
      CssBaseline,
      Drawer,
      Fade,
      FormControl,
      InputLabel,
      List,
      ListItemAvatar,
      ListItemButton,
      ListItemIcon,
      ListItemText,
      MenuItem,
      Modal,
      Select,
      Stack,
      styled,
      TextField,
      Typography,
      useTheme
} from '@mui/material';
import { getJsonFromUrl } from '../../utils/basic';

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import CommitIcon from '@mui/icons-material/Commit';
import AddIcon from '@mui/icons-material/Add';

import { SocketContext } from '../../../socket';
import { GlobalContext } from '../../../globalContext';
import formatDate from '../../utils/processTime';

const Heading = styled(Typography)(({ theme }) => ({
      margin: '1rem 0 .25rem',
      color: theme.palette.grey[600],
      fontWeight: 700,
      fontSize: theme.typography.pxToRem(11),
      textTransform: 'uppercase',
      letterSpacing: '.08rem',
}));

export default function Doc(props) {
      const id = useMatch("/doc/:id").params.id;
      const commitId = getJsonFromUrl().commit;

      const theme = useTheme();
      const auth = React.useContext(AuthContext);
      const globalContext = React.useContext(GlobalContext);
      const socket = React.useContext(SocketContext);

      const doc = auth.user?.documents?.find(doc => doc.id === id);

      const setData = React.useRef(() => { });
      const [words, setWords] = React.useState({ words: 0, characters: 0 });
      const [commit, setCommit] = React.useState({});
      const [subCommit, setSubCommit] = React.useState({});
      const [commiter, setCommiter] = React.useState({});
      const navigate = useNavigate();
      const [documentSize, setDocumentSize] = React.useState(0);
      const [leftPanelOpen, setLeftPanelOpen] = React.useState(false);
      const [createCommitModal, setCreateCommitModal] = React.useState(false);
      const [newCommit, setNewCommit] = React.useState({
            message: '',
            content: '',
      });

      function createCommit(id, message, content, cb) {
            axios.post(`/api/docs/create/commit`, {
                  docId: id,
                  message,
                  content,
            }).then(res => {
                  const data = res.data;
                  auth.setUser(data.data);
                  globalContext.showSnackBar(data.message, {
                        variant: 'success',
                        transition: 'right'
                  });
                  if (typeof cb === 'function') cb(data);
            }).catch(err => {
                  console.error(err);
                  globalContext.showSnackBar(err.message, {
                        variant: 'error',
                        transition: 'right'
                  });
            })
      }

      React.useEffect(() => {
            if (doc && typeof doc === 'object' && commitId && typeof commitId === 'string' && commitId.length > 0) {
                  const commitDoc = doc.commits.find(commit => commit.id === commitId);

                  if (commitDoc) {
                        setCommit(commitDoc);
                        setSubCommit(commitDoc);
                  }
                  else {
                        navigate(`/doc/${id}`);
                        if (doc.commits.length > 0) {
                              setCommit(doc.commits[0]);
                              setSubCommit(doc.commits[0]);
                        } else {
                              createCommit(doc.id, undefined, undefined, data => {
                                    setCommit(data?.data?.documents?.find(doc => doc.id === id)?.commits[0]);
                                    setSubCommit(data?.data?.documents?.find(doc => doc.id === id)?.commits[0]);
                              });
                        }
                  }
            } else if (!commitId || commitId.length === 0 || typeof commitId !== 'string') {
                  if (doc.commits.length > 0) {
                        setCommit(doc.commits[0]);
                        setSubCommit(doc.commits[0]);
                  } else {
                        createCommit(doc.id, undefined, undefined, data => {
                              setCommit(data?.data?.documents?.find(doc => doc.id === id)?.commits[0]);
                              setSubCommit(data?.data?.documents?.find(doc => doc.id === id)?.commits[0]);
                        });
                  }
            }
      }, []);

      function onAutoSave(editor) {
            const value = editor.getData();
            socket.emit('autoSave', {
                  docId: id,
                  commitId: commit.id,
                  content: value,
                  cookie: window.document.cookie
            });
      }

      React.useEffect(() => {
            if (auth.user.email === commit.commiter) {
                  setCommiter(auth.user);
            } else if (doc.others.includes(commit.commiter)) {
                  let others = props.state.others;
                  for (const user of others) {
                        if (user.email === commit.commiter) {
                              setCommiter(user);
                              break;
                        }
                  };
            } else if (commit.commiter) {
                  axios.post(`/api/base/getUser`, {
                        email: commit.commiter,
                  }).then(res => {
                        const data = res.data;
                        setCommiter(data.data);
                  }).catch(err => {
                        console.log(err);
                  });
            }

            socket.on('autoSave', ({ docId, commitId, content }) => {
                  console.log(docId, commitId, content);
                  if (docId === id && commitId === commit.id) {
                        setCommit({ ...commit, content });
                        // if (typeof setData.current === 'function') setData.current(content);
                  }
            });
      }, [commit.commiter]);

      return (<>
            <Header
                  navContent={<>

                  </>}
                  sideBarContent={<>
                        <Heading gutterBottom>
                              Document Settings
                        </Heading>
                        <Chip
                              label={`Words: ${words.words}`}
                              variant="outlined"
                              size="small"
                              color="primary"
                              sx={{ mx: '2px', fontWeight: 'bold' }}
                        />
                        <Chip
                              label={`Characters: ${words.characters}`}
                              variant="outlined"
                              size="small"
                              color="primary"
                              sx={{ mx: '2px', fontWeight: 'bold' }}
                        />

                        {/* <FormControl sx={{
                              width: '100%',
                              marginTop: '1rem',
                              marginBottom: '2rem'
                        }}>
                              <InputLabel id="demo-simple-select-helper-label">Document Size</InputLabel>
                              <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={documentSize}
                                    label="Document Size"
                                    onChange={e => setDocumentSize(e.target.value)}
                              >
                                    {DocumentSizeList.map((size, index) => <MenuItem key={index} value={index}>{size.name} ({size.width}×{size.height})</MenuItem>)}
                              </Select>
                        </FormControl> */}
                  </>}
            />
            <CssBaseline />
            <Box sx={{
                  display: 'flex',
                  height: 'calc(100% - 52px)',
            }}>
                  <Drawer
                        sx={{
                              width: '300px',
                              height: '100%',
                              flexShrink: 0,
                              '& .MuiDrawer-paper': {
                                    width: '300px',
                                    boxSizing: 'border-box',
                                    height: '100%',
                                    position: 'relative',
                                    borderTop: '1px solid',
                                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                              },
                        }}
                        variant="persistent"
                        anchor="left"
                        open={leftPanelOpen}
                  >
                        <Box sx={{
                              width: '100%',
                              height: '100%',
                              p: '0.5rem',
                        }}>
                              <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                              }}>
                                    <Typography
                                          variant="h6"
                                          sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                          }}
                                    >Commits</Typography>
                                    <Button variant="outlined" startIcon={<AddIcon />} color="success" size='small' sx={{
                                          height: '30px',
                                          mr: '1rem !important',
                                    }} onClick={() => { setCreateCommitModal(true) }}>New Commit</Button>
                              </Box>

                              <List dense>
                                    {doc.commits.map((commit, index) => (
                                          <ListItemButton
                                                key={index}
                                                selected={(function () {
                                                      if (commitId && typeof commitId === 'string' && commitId.length > 0) {
                                                            return commitId === commit.id;
                                                      } else {
                                                            return index === 0;
                                                      }
                                                })()}
                                                onClick={() => {
                                                      navigate(`/doc/${id}?commit=${commit.id}`);
                                                      setCommit(commit);
                                                      setData.current(commit.content);
                                                }}
                                          >
                                                <ListItemAvatar>
                                                      <Avatar alt={commiter.name} src={commiter.avatar} imgProps={{ referrerPolicy: 'no-referrer' }} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                      primary={commit.message}
                                                      secondary={formatDate(commit.created_at, "$MMMM $d, $yyyy, $h:$mm:$ss $TT")}
                                                />
                                          </ListItemButton>
                                    ))}
                              </List>
                        </Box>
                  </Drawer>

                  <Box sx={(theme) => ({
                        flexGrow: 1,
                        height: '100%',
                        width: '100%',
                        marginLeft: `-300px`,
                        transition: theme.transitions.create(['margin', 'width'], {
                              easing: theme.transitions.easing.sharp,
                              duration: theme.transitions.duration.leavingScreen,
                        }),
                        ...(leftPanelOpen && {
                              width: 'calc(100% - 300px)',
                              transition: theme.transitions.create(['margin', 'width'], {
                                    easing: theme.transitions.easing.easeOut,
                                    duration: theme.transitions.duration.enteringScreen,
                              }),
                              marginLeft: 0,
                        }),
                  })}>
                        {(commit.content || commit.content === '') ?
                              <RichEditor
                                    sx={{
                                          height: '100%',
                                    }}
                                    data={commit?.content || ''}
                                    setData={setData}
                                    onAutoSave={onAutoSave}
                                    autoSaveWaitingTime={500}
                                    onWordCountUpdate={stats => {
                                          setWords(stats);
                                    }}
                                    extraButtons={<>
                                          <Button variant='outlined' sx={{
                                                height: '40px',
                                                minWidth: '41px',
                                                width: '41px',
                                                mr: '2px',
                                                color: theme.palette.text.primary,
                                                border: '1px solid',
                                                borderColor: theme.palette.text.primary,
                                                '&:hover': {
                                                      color: '#90caf9',
                                                      borderColor: '#90caf9',
                                                }
                                          }} onClick={e => {
                                                e.stopPropagation();
                                                setLeftPanelOpen(!leftPanelOpen);
                                          }}>
                                                <DoubleArrowIcon sx={(theme) => ({
                                                      transform: leftPanelOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                      transition: theme.transitions.create('transform', {
                                                            easing: theme.transitions.easing.easeInOut,
                                                            duration: theme.transitions.duration.enteringScreen,
                                                      }),
                                                })} />
                                          </Button>
                                    </>}
                                    toolbarStylesSX={{
                                          width: 'calc(100% - 43px)',
                                    }}
                              // contentSize={{
                              //       width: `${DocumentSizeList[documentSize].width}${DocumentSizeList[documentSize].unit}`,
                              //       height: `${DocumentSizeList[documentSize].height}${DocumentSizeList[documentSize].unit}`,
                              // }}
                              />
                              :
                              <Box sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                              }}>
                                    <CustomCircularProgress />
                              </Box>
                        }
                  </Box>
            </Box>

            <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={createCommitModal}
                  onClose={() => setCreateCommitModal(false)}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                        timeout: 500,
                  }}
            >
                  <Fade in={createCommitModal}>
                        <Box sx={{
                              p: 4,
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              maxWidth: 'calc(100% - 40px)',
                              maxHeight: 'calc(100% - 40px)',
                              transform: 'translate(-50%, -50%)',
                              bgcolor: 'background.default',
                              borderRadius: '8px',
                              boxShadow: 24,
                              overflow: 'auto',
                        }}>
                              <Stack direction='column' spacing={1} sx={{}}>
                                    <TextField
                                          id="outlined-basic"
                                          label="Commit Message"
                                          variant="outlined"
                                          helperText="* Enter the message that will be shown up in the commit history"
                                          fullWidth
                                          required
                                          value={newCommit.message}
                                          onChange={(e) => { setNewCommit({ ...newCommit, message: e.target.value }) }}
                                    />

                                    <Button variant="outlined" startIcon={<AddIcon />} color="success" size='small' sx={{
                                          height: '40px',
                                          mr: '1rem !important',
                                    }} onClick={() => {
                                          createCommit(doc.id, newCommit.message, undefined, data => {
                                                setNewCommit({ message: '', content: '' });
                                                setCreateCommitModal(false);
                                          });
                                    }}>New Document</Button>
                              </Stack>
                        </Box>
                  </Fade>
            </Modal>
      </>)
}


function CustomCircularProgress(props) {
      return (
            <Box sx={{ position: 'relative' }}>
                  <CircularProgress
                        variant="determinate"
                        sx={{
                              color: (theme) =>
                                    theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                        }}
                        size={40}
                        thickness={4}
                        {...props}
                        value={100}
                  />
                  <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                              color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                              animationDuration: '550ms',
                              position: 'absolute',
                              left: 0,
                              [`& .${circularProgressClasses.circle}`]: {
                                    strokeLinecap: 'round',
                              },
                        }}
                        size={40}
                        thickness={4}
                        {...props}
                  />
            </Box>
      );
}

import React from 'react'
import axios from 'axios'
import RichEditor from '../../editor/editor';
import { processTimeForDashboard } from '../../utils/processTime';
import { AuthContext } from '../../auth/authContext';

import {
      Avatar,
      AvatarGroup,
      Backdrop,
      Box,
      Button,
      Chip,
      Collapse,
      Fade,
      IconButton,
      Modal,
      Stack,
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      TableRow,
      Typography,
      Tooltip,
      useTheme,
      Dialog,
      DialogTitle,
      DialogContent,
      DialogContentText,
      DialogActions,
      GlobalStyles,
      styled,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import PageviewIcon from '@mui/icons-material/Pageview';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../../globalContext';

const CustomTableHead = styled(TableHead)({
      'th': {
            fontWeight: '700',
      }
});

const CustomTableBody = styled(TableBody)({
      'td': {
            fontWeight: '500',
      }
});

export default function Documents(props) {

      const [preview, setPreview] = React.useState({
            commiter: {},
            commit: {},
            open: false,
      });
      const [openedDocsCommit, setOpenedDocsCommit] = React.useState(false);

      return <TableContainer sx={{
            ...props.sx,
      }}>
            <GlobalStyles styles={{

            }} />
            <Table aria-label="collapsible table" size='small' sx={{
                  backgroundColor: 'background.secondary',
                  borderRadius: '8px',
                  overflow: 'hidden',
            }}>

                  <CustomTableHead>
                        <TableRow>
                              <TableCell />
                              <TableCell sx={{ whiteSpace: 'nowrap' }}>Name</TableCell>
                              <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>Owner</TableCell>
                              <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>Others</TableCell>
                              <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>Created At</TableCell>
                              <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>Last Modified At</TableCell>
                              <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>View</TableCell>
                              <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>Commits</TableCell>
                        </TableRow>
                  </CustomTableHead>

                  <CustomTableBody>
                        {props.docs.length > 0 ?
                              props.docs.sort((a, b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime())).map((doc, index) =>
                                    (<Document key={`${doc.name}${index}`} doc={doc} index={index} setPreview={setPreview} openedDocsCommit={{ value: openedDocsCommit, set: setOpenedDocsCommit }} />))
                              :
                              <TableCell colSpan={8} align="center">
                                    <Typography variant="h6" component="div" sx={{
                                          fontSize: '1rem',
                                          fontWeight: 'bold',
                                    }}>
                                          No Document Found
                                    </Typography>
                              </TableCell>
                        }
                  </CustomTableBody>

            </Table>

            <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={preview.open}
                  onClose={() => setPreview({ ...preview, open: false })}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                        timeout: 500,
                  }}
            >
                  <Fade in={preview.open}>
                        <Box sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              width: 'calc(100% - 40px)',
                              height: 'calc(100% - 40px)',
                              transform: 'translate(-50%, -50%)',
                              bgcolor: 'background.default',
                              borderRadius: '8px',
                              boxShadow: 24,
                              p: 4,
                              overflow: 'auto',
                        }}>
                              <Box sx={{
                                    width: '100%',
                                    position: 'relative',
                              }}>
                                    <IconButton onClick={() => setPreview({ ...preview, open: false })} sx={{
                                          position: 'absolute',
                                          top: '0',
                                          right: '0',
                                    }}><CloseIcon /></IconButton>

                                    <TableContainer sx={{
                                          width: '100%',
                                    }}>
                                          <Table aria-label="collapsible table" size='small' sx={{
                                                backgroundColor: 'background.secondary',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                          }}>
                                                <CustomTableHead>
                                                      <TableRow>
                                                            <TableCell>Commiter</TableCell>
                                                            <TableCell>Commit Message</TableCell>
                                                            <TableCell>Commit Date</TableCell>
                                                            <TableCell>Last Modified</TableCell>
                                                      </TableRow>
                                                </CustomTableHead>

                                                <CustomTableBody>
                                                      <TableRow>
                                                            <TableCell>
                                                                  <Tooltip title={preview.commiter?.email || ""} arrow>
                                                                        <Chip
                                                                              avatar={<Avatar alt={preview.commiter?.name} src={preview.commiter?.avatar} imgProps={{ referrerPolicy: 'no-referrer' }} />}
                                                                              label={preview.commiter?.name}
                                                                              variant="outlined"
                                                                              sx={{ cursor: 'pointer' }}
                                                                        />
                                                                  </Tooltip>
                                                            </TableCell>
                                                            <TableCell>{preview.commit?.message}</TableCell>
                                                            <TableCell>{processTimeForDashboard(preview.commit?.created_at)}</TableCell>
                                                            <TableCell>{processTimeForDashboard(preview.commit?.last_modified)}</TableCell>
                                                      </TableRow>
                                                </CustomTableBody>
                                          </Table>
                                    </TableContainer>
                              </Box>

                              <RichEditor
                                    data={preview.commit?.content}
                                    readOnly
                                    sx={{
                                          width: '100%',
                                          height: 'auto'
                                    }}
                              />

                        </Box>
                  </Fade>
            </Modal>
      </TableContainer>
}

function Document(props) {
      const auth = React.useContext(AuthContext);
      const globalContext = React.useContext(GlobalContext);
      const theme = useTheme();

      const doc = props.doc;
      const index = props.index;
      const setPreview = props.setPreview;
      const openedDocsCommit = props.openedDocsCommit;

      const [state, setState] = React.useState({
            owner: {},
            others: [],
      });

      React.useEffect(() => {
            if (auth.user.email === doc.owner) {
                  setState(state => ({
                        ...state,
                        owner: auth.user,
                  }))
            } else {
                  axios.post(`/api/base/getUser`, {
                        email: doc.owner,
                  }).then(res => {
                        setState(state => ({
                              ...state,
                              owner: res.data.data,
                        }))
                  }).catch(err => {
                        console.log(err);
                  });
            }

            axios.post('/api/base/getUsers', {
                  users: doc.others,
            }).then(res => {
                  setState(state => ({
                        ...state,
                        others: res.data.data,
                  }));
            }).catch(err => {
                  console.log(err);
            });
      }, []);

      return (<>

            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell>
                        <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => openedDocsCommit.set(prev => {
                                    if (prev === index) {
                                          return -1;
                                    } else {
                                          return index;
                                    }
                              })}
                        >
                              {openedDocsCommit.value === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                  </TableCell>

                  <TableCell component="th" scope="row" sx={{
                        whiteSpace: 'nowrap',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                  }}>
                        <Link to={`/doc/${doc.id}`} style={{
                              color: theme.palette.text.primary,
                        }}>
                              {doc.name}
                        </Link>
                  </TableCell>

                  <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title={state.owner.email || ""} arrow>
                              <Avatar src={state.owner.avatar} alt={state.owner.name} imgProps={{ referrerPolicy: 'no-referrer' }} sx={{
                                    cursor: 'pointer',
                              }} />
                        </Tooltip>
                  </TableCell>

                  <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
                        {state.others.length > 0 ?
                              <AvatarGroup max={3}>
                                    {state.others.map((user, index) => (
                                          <Tooltip key={`Avatar-${user.email}-${index}`} title={user.email || ""} arrow>
                                                <Avatar src={user.avatar} alt={user.name} imgProps={{ referrerPolicy: 'no-referrer' }} sx={{
                                                      cursor: 'pointer',
                                                }} />
                                          </Tooltip>
                                    ))}
                              </AvatarGroup>
                              :
                              "No Colaboration Found"
                        }
                  </TableCell>

                  <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>{processTimeForDashboard(doc.created_at)}</TableCell>
                  <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>{processTimeForDashboard(doc.last_modified)}</TableCell>
                  <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
                        {doc.isPublic ? <Chip label="Public" variant="outlined" color="success" size="small" /> : <Chip label="Private" variant="outlined" color="error" size="small" />}
                  </TableCell>
                  <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}><Chip label={`${doc.commits?.length} Commit Found`} variant="outlined" color="success" size="small" /></TableCell>
            </TableRow>

            <TableRow sx={theme => ({
                  backgroundColor: theme.palette.mode === 'dark' ? '#2c2f35' : '#e2e2e2',
            })}>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={openedDocsCommit.value === index} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div" sx={{
                                          fontSize: '1rem',
                                          fontWeight: 'bolder',
                                    }}>
                                          Commits
                                    </Typography>

                                    <Table size="small" aria-label="purchases">
                                          <CustomTableHead>
                                                <TableRow>
                                                      <TableCell>Commiter</TableCell>
                                                      <TableCell>Commit Message</TableCell>
                                                      <TableCell>Commit Date</TableCell>
                                                      <TableCell>Last Modified</TableCell>
                                                      <TableCell align='center'>Actions</TableCell>
                                                </TableRow>
                                          </CustomTableHead>

                                          <CustomTableBody>
                                                {doc.commits.length > 0 ?
                                                      doc.commits.sort((a, b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime())).map((commit, index) => {
                                                            function Child(props) {
                                                                  const commit = props.commit;
                                                                  const [state, setState] = React.useState({
                                                                        commiter: {},
                                                                  });
                                                                  const [deleteAlert, setDeleteAlert] = React.useState(false);

                                                                  React.useEffect(() => {
                                                                        if (auth.user.email === commit.commiter) {
                                                                              setState(state => ({
                                                                                    ...state,
                                                                                    commiter: auth.user,
                                                                              }))
                                                                        } else if (doc.others.includes(commit.commiter)) {
                                                                              let others = props.state.others;
                                                                              for (const user of others) {
                                                                                    if (user.email === commit.commiter) {
                                                                                          setState(state => ({
                                                                                                ...state,
                                                                                                commiter: user,
                                                                                          }))
                                                                                    }
                                                                              };
                                                                        } else if (commit.commiter === props.state.owner?.email) {
                                                                              setState(state => ({
                                                                                    ...state,
                                                                                    commiter: props.state.owner,
                                                                              }))
                                                                        } else {
                                                                              axios.post(`/api/base/getUser`, {
                                                                                    email: commit.commiter,
                                                                              }).then(res => {
                                                                                    setState(state => ({
                                                                                          ...state,
                                                                                          commiter: res.data.data,
                                                                                    }))
                                                                              }).catch(err => {
                                                                                    console.log(err);
                                                                              });
                                                                        }
                                                                  }, []);

                                                                  return (
                                                                        <TableRow>
                                                                              <TableCell>
                                                                                    <Tooltip title={state.commiter.email || ""} arrow>
                                                                                          <Chip
                                                                                                avatar={<Avatar alt={state.commiter.name} src={state.commiter.avatar} imgProps={{ referrerPolicy: 'no-referrer' }} />}
                                                                                                label={state.commiter.name}
                                                                                                variant="outlined"
                                                                                                sx={{ cursor: 'pointer' }}
                                                                                          />
                                                                                    </Tooltip>
                                                                              </TableCell>
                                                                              <TableCell>
                                                                                    <Link to={`/doc/${doc.id}?commit=${commit.id}`} style={{
                                                                                          color: theme.palette.text.primary,
                                                                                    }}>
                                                                                          {commit.message}
                                                                                    </Link>
                                                                              </TableCell>
                                                                              <TableCell>{processTimeForDashboard(commit.created_at)}</TableCell>
                                                                              <TableCell>{processTimeForDashboard(commit.last_modified)}</TableCell>
                                                                              <TableCell align='center'>
                                                                                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                                                                                          <Button variant="outlined" startIcon={<PageviewIcon />} color="success" onClick={() => {
                                                                                                setPreview({
                                                                                                      commit: commit,
                                                                                                      commiter: state.commiter,
                                                                                                      open: true,
                                                                                                })
                                                                                          }}>
                                                                                                Preview
                                                                                          </Button>
                                                                                          <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => {
                                                                                                setDeleteAlert(true);
                                                                                          }}>
                                                                                                Delete
                                                                                          </Button>

                                                                                          <Dialog
                                                                                                open={deleteAlert}
                                                                                                onClose={() => { setDeleteAlert(false) }}
                                                                                                aria-labelledby="alert-dialog-title"
                                                                                                aria-describedby="alert-dialog-description"
                                                                                                PaperProps={{
                                                                                                      sx: {
                                                                                                            backgroundColor: theme.palette.background.default,
                                                                                                            color: theme.palette.text.primary,
                                                                                                            borderRadius: '8px',
                                                                                                            backgroundImage: 'none',
                                                                                                      }
                                                                                                }}
                                                                                          >
                                                                                                <DialogTitle id="alert-dialog-title">
                                                                                                      {"Are you sure you want to delete this commit?"}
                                                                                                </DialogTitle>

                                                                                                <DialogContent>
                                                                                                      <DialogContentText id="alert-dialog-description">
                                                                                                            This action cannot be undone.
                                                                                                      </DialogContentText>
                                                                                                </DialogContent>

                                                                                                <DialogActions>
                                                                                                      <Button variant="outlined" startIcon={<PageviewIcon />} color="success" onClick={() => {
                                                                                                            setDeleteAlert(false);
                                                                                                      }}>
                                                                                                            Cancel
                                                                                                      </Button>

                                                                                                      <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => {
                                                                                                            axios.post("/api/docs/delete/commit", {
                                                                                                                  docId: doc.id,
                                                                                                                  commitId: commit.id,
                                                                                                            }).then(res => {
                                                                                                                  const data = res.data;
                                                                                                                  if (data.status === 200) {
                                                                                                                        auth.setUser(data.data);
                                                                                                                        globalContext.showSnackBar(data.message, {
                                                                                                                              variant: 'success',
                                                                                                                              transition: 'right'
                                                                                                                        });
                                                                                                                  } else {
                                                                                                                        globalContext.showSnackBar(data.message, {
                                                                                                                              variant: 'error',
                                                                                                                              transition: 'right'
                                                                                                                        });
                                                                                                                  }
                                                                                                            }).catch(err => {
                                                                                                                  console.log(err);
                                                                                                                  globalContext.showSnackBar(err.message, {
                                                                                                                        variant: 'error',
                                                                                                                        transition: 'right'
                                                                                                                  });
                                                                                                            });
                                                                                                      }}>
                                                                                                            Delete
                                                                                                      </Button>
                                                                                                </DialogActions>
                                                                                          </Dialog>

                                                                                    </Stack>
                                                                              </TableCell>

                                                                        </TableRow>
                                                                  );
                                                            }
                                                            return <Child key={`${commit.message}${index}`} commit={commit} state={state} />
                                                      })
                                                      :
                                                      <TableCell colSpan={5} align='center'>
                                                            <Typography variant="h6" component="div" sx={{
                                                                  fontSize: '1rem',
                                                                  fontWeight: 'bold',
                                                            }}>
                                                                  No Commit Was Found
                                                            </Typography>
                                                      </TableCell>
                                                }
                                          </CustomTableBody>
                                    </Table>
                              </Box>
                        </Collapse>
                  </TableCell>
            </TableRow >

      </>)
}

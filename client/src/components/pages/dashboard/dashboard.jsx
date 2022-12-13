import React from 'react'
import Header from '../../utils/header'
import Documents from './documents';
import { AuthContext } from '../../auth/authContext';
import { GlobalContext } from '../../../globalContext';

import {
      Backdrop,
      Box,
      Button,
      Fade,
      FormControlLabel,
      FormHelperText,
      Modal,
      Stack,
      Switch,
      TextField,
      Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

export default function Dashboard(props) {

      const auth = React.useContext(AuthContext);
      const globalContext = React.useContext(GlobalContext);
      const [createDocumentModal, setCreateDocumentModal] = React.useState(false);
      const [newDocument, setNewDocument] = React.useState({
            name: '',
            isPublic: true,
      });

      return (<>
            <Header />

            <Box sx={{
                  width: '100%',
                  height: 'calc(100% - 52px)',
                  overflow: 'auto',
            }}>
                  <Box sx={{
                        width: '100%',
                        height: '52px'
                  }}>
                        <Stack direction='row' spacing={1} sx={{
                              alignItems: 'center',
                              justifyContent: 'space-between',
                        }}>

                              <Typography variant="h5" sx={{
                                    fontSize: '1.5rem',
                                    fontWeight: '900',
                                    lineHeight: '52px',
                                    pl: '1rem',
                              }}>Dashboard</Typography>

                              <Button variant="outlined" startIcon={<AddIcon />} color="success" size='small' sx={{
                                    height: '40px',
                                    mr: '1rem !important',
                              }} onClick={() => { setCreateDocumentModal(true) }}>New Document</Button>

                        </Stack>
                  </Box>

                  <Documents docs={auth.user.documents} sx={{
                        width: '100%',
                        margin: '0 auto',
                        padding: '20px',
                        height: 'calc(100% - 52px)',
                        overflow: 'auto',
                  }} />
            </Box>

            <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={createDocumentModal}
                  onClose={() => setCreateDocumentModal(false)}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                        timeout: 500,
                  }}
            >
                  <Fade in={createDocumentModal}>
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
                                          label="Document Name"
                                          variant="outlined"
                                          helperText="* Enter the name of the document"
                                          fullWidth
                                          required
                                          value={newDocument.name}
                                          onChange={(e) => { setNewDocument({ ...newDocument, name: e.target.value }) }}
                                    />
                                    <FormControlLabel
                                          labelPlacement="start"
                                          control={<Switch
                                                color="primary"
                                                checked={newDocument.isPublic}
                                                onChange={(e) => { setNewDocument({ ...newDocument, isPublic: e.target.checked }) }}
                                          />}
                                          label="Is Public"
                                          sx={{
                                                justifyContent: 'flex-end',
                                          }}
                                    />
                                    <FormHelperText>* If public, then anybody on the web can see the document.</FormHelperText>

                                    <Button variant="outlined" startIcon={<AddIcon />} color="success" size='small' sx={{
                                          height: '40px',
                                          mr: '1rem !important',
                                    }} onClick={() => {
                                          axios.post("/api/docs/create", newDocument).then(res => {
                                                const data = res.data;
                                                if (data.status === 200) {
                                                      auth.setUser(data.data);
                                                      globalContext.showSnackBar(data.message, {
                                                            variant: 'success',
                                                            transition: 'right'
                                                      });
                                                      setCreateDocumentModal(false);
                                                } else {
                                                      globalContext.showSnackBar(data.message, {
                                                            variant: 'error',
                                                            transition: 'right'
                                                      });
                                                      setCreateDocumentModal(false);
                                                }
                                          }).catch(err => {
                                                globalContext.showSnackBar(err.message, {
                                                      variant: 'error',
                                                      transition: 'right'
                                                });
                                                setCreateDocumentModal(false);
                                          });
                                    }}>New Document</Button>
                              </Stack>
                        </Box>
                  </Fade>
            </Modal>
      </>)
}


import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Header from './components/utils/header';
import { Box } from '@mui/material';
import Editor from './components/editor/editor';
import Home from './components/pages/home';
import Doc from './components/pages/doc/doc';
import Dashboard from './components/pages/dashboard/dashboard';
import { AuthContext } from './components/auth/authContext';

export default function App(props) {

      return (
            <Box sx={{
                  backgroundColor: 'background.paper',
                  color: 'text.primary',
                  height: '100%',
                  width: '100%',
                  overflow: 'auto',
            }}>
                  <Routes>

                        <Route path="/" element={<Home />} />
                        <Route path="/test/editor" element={<>
                              <Header />
                              <Editor
                                    sx={{
                                          height: 'calc(100% - 52px)'
                                    }}
                                    data={localStorage.getItem('test/editor/data')}
                                    autoSaveWaitingTime={50}
                                    onAutoSave={(editor) => {
                                          localStorage.setItem('test/editor/data', editor.getData());
                                    }}
                              // readOnly
                              />
                        </>}
                        />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/doc/:id" element={<Doc />} />

                        {/* 404 Error */}
                        <Route
                              path="*"
                              element={
                                    <main style={{ padding: "1rem" }}>
                                          <p>There's nothing here!</p>
                                    </main>
                              }
                        />

                  </Routes>
            </Box>
      )
}

const ProtectedRoute = ({ children }) => {

      const auth = React.useContext(AuthContext);

      if (auth.isAuthenticated) {
            return children;
      }
      return <Navigate to="/" />
}

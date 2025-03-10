import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Connections from './pages/Connections';
import QueryEditor from './pages/QueryEditor';
import SchemaVisualizer from './pages/SchemaVisualizer';
import Backup from './pages/Backup';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout>
                  <Outlet />
                </Layout>
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/query" element={<QueryEditor />} />
            <Route path="/backup" element={<Backup />} />
            <Route path="/schema" element={<SchemaVisualizer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

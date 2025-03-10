import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAuth } from '../lib/auth';
import { Database, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { MySQLConnection } from '../types/database';

const Connections = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [connections, setConnections] = useState<MySQLConnection[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: '3306',
    database: '',
    username: '',
    password: '',
  });
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    const { data, error } = await supabase
      .from('mysql_connections')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      setAlert({
        open: true,
        message: 'Failed to fetch connections',
        severity: 'error',
      });
      return;
    }

    setConnections(data || []);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      host: '',
      port: '3306',
      database: '',
      username: '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    

    const { error } = await supabase.from('mysql_connections').insert({
      user_id: user?.id,
      name: formData.name,
      host: formData.host,
      port: parseInt(formData.port),
      database: formData.database,
      username: formData.username,
      password: formData.password,
    });

    if (error) {
      setAlert({
        open: true,
        message: 'Failed to create connection',
        severity: 'error',
      });
      return;
    }

    setAlert({
      open: true,
      message: 'Connection created successfully',
      severity: 'success',
    });
    handleClose();
    fetchConnections();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('mysql_connections')
      .delete()
      .eq('id', id);

    if (error) {
      setAlert({
        open: true,
        message: 'Failed to delete connection',
        severity: 'error',
      });
      return;
    }

    setAlert({
      open: true,
      message: 'Connection deleted successfully',
      severity: 'success',
    });
    fetchConnections();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Database Connections</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleClickOpen}
        >
          New Connection
        </Button>
      </Box>

      <Paper>
        <List>
          {connections.map((connection) => (
            <ListItem
              key={connection.id}
              secondaryAction={
                <Button
                  color="error"
                  startIcon={<Trash2 size={20} />}
                  onClick={() => handleDelete(connection.id)}
                >
                  Delete
                </Button>
              }
            >
              <ListItemIcon>
                <Database size={24} />
              </ListItemIcon>
              <ListItemText
                primary={connection.name}
                secondary={`${connection.host}:${connection.port}`}
              />
            </ListItem>
          ))}
          {connections.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No connections"
                secondary="Click 'New Connection' to add one"
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Database Connection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Connection Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="host"
            label="Host"
            fullWidth
            variant="outlined"
            value={formData.host}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="port"
            label="Port"
            fullWidth
            variant="outlined"
            value={formData.port}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="database"
            label="Database"
            fullWidth
            variant="outlined"
            value={formData.database}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="username"
            label="Username"
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Connections;
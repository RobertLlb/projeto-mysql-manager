import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Save, Upload } from 'lucide-react';

const Backup = () => {
  const [backupSQL, setBackupSQL] = useState(''); // Estado para armazenar o SQL gerado
  const [openModal, setOpenModal] = useState(false); // Estado para controlar o modal
  const [backups, setBackups] = useState([
    // Exemplo de backups (pode ser substituído por dados do backend)
    {
      name: 'database_backup_2024_03_06.sql',
      date: 'March 6, 2024 - 12:30 PM',
    },
  ]);

  // Função para criar o backup
  const handleCreateBackup = async () => {
    try {
      const response = await fetch('http://localhost:5000/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: 'localhost', // Substitua pelos valores reais
          user: 'root',
          password: 'password',
          database: 'your_database',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setBackupSQL(data.file); // Armazena o nome do arquivo de backup
        setOpenModal(true); // Abre o modal para exibir o SQL
        setBackups([...backups, { name: data.file, date: new Date().toLocaleString() }]); // Atualiza a lista de backups
      } else {
        console.error('Erro ao criar backup:', data.error);
      }
    } catch (error) {
      console.error('Erro ao criar backup:', error);
    }
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Backup & Restore
      </Typography>

      <Grid container spacing={3}>
        {/* Criar Backup */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Create Backup
            </Typography>
            <Button
              variant="contained"
              startIcon={<Save size={20} />}
              fullWidth
              onClick={handleCreateBackup}
            >
              Backup Database
            </Button>
          </Paper>
        </Grid>

        {/* Restaurar Backup */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Restore Backup
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Upload size={20} />}
              fullWidth
            >
              Select Backup File
            </Button>
          </Paper>
        </Grid>

        {/* Lista de Backups */}
        <Grid item xs={12}>
          <Paper sx={{ mt: 2 }}>
            <List>
              {backups.map((backup, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Save size={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={backup.name}
                    secondary={`Created on ${backup.date}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para exibir o SQL gerado */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Backup SQL</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={10}
            value={backupSQL}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Backup;
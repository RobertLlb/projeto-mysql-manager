import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { Play } from 'lucide-react';

const QueryEditor = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Query Editor
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={8}
          placeholder="Enter your SQL query here..."
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<Play size={20} />}
        >
          Execute Query
        </Button>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Results
        </Typography>
      </Paper>
    </Box>
  );
};

export default QueryEditor;
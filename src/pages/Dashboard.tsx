import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { Database, Terminal, Save } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Active Connections',
      value: '3',
      icon: <Database size={32} />,
    },
    {
      title: 'Queries Today',
      value: '150',
      icon: <Terminal size={32} />,
    },
    {
      title: 'Latest Backup',
      value: '2h ago',
      icon: <Save size={32} />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              }}
            >
              {stat.icon}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" color="primary">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
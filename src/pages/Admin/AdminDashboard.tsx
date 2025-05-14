import React from 'react';
import {
  Box, Grid, Paper, Typography, useTheme
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsightsIcon from '@mui/icons-material/Insights';
import AdminLayout from '../../layouts/AdminLayout';

const summary = [
  { label: 'Total Scans', value: 1342, icon: <AssessmentIcon color="primary" /> },
  { label: 'Threats Detected', value: 118, icon: <SecurityIcon color="error" /> },
  { label: 'Clean Files', value: 1224, icon: <CheckCircleIcon color="success" /> },
  { label: 'Model Accuracy', value: '97.6%', icon: <InsightsIcon color="info" /> },
];

const lineData = [
  { day: 'Mon', scans: 120 },
  { day: 'Tue', scans: 150 },
  { day: 'Wed', scans: 98 },
  { day: 'Thu', scans: 210 },
  { day: 'Fri', scans: 180 },
  { day: 'Sat', scans: 75 },
  { day: 'Sun', scans: 90 },
];

const pieData = [
  { name: 'Malware', value: 40 },
  { name: 'Phishing', value: 25 },
  { name: 'Ransomware', value: 15 },
  { name: 'Safe', value: 20 },
];

const COLORS = ['#e74c3c', '#f1c40f', '#8e44ad', '#2ecc71'];

const AdminDashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <AdminLayout>
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>

      <Grid container spacing={3}>
        {summary.map((item) => (
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.icon}
              <Box>
                <Typography variant="subtitle2">{item.label}</Typography>
                <Typography variant="h6">{item.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Scans Over Time</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scans" stroke={theme.palette.primary.main} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Threat Breakdown</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={theme.palette.primary.main}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;

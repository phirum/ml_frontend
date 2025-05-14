import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Divider } from '@mui/material';
import UserLayout from '../../layouts/UserLayout';

const UserDashboard = () => {
  return (
    <UserLayout>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        👋 Welcome back, Analyst!
      </Typography>

      <Grid container spacing={3}>
         <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'green.100', borderLeft: '6px solid #43a047', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Scans
              </Typography>
              <Typography variant="h4" color="success.main">321</Typography>
              <Typography variant="body2" color="text.secondary">+12% from last week</Typography>
            </CardContent>
          </Card>
        </Grid>

         <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'red.100', borderLeft: '6px solid #e53935', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Threats Detected
              </Typography>
              <Typography variant="h4" color="error.main">56</Typography>
              <Typography variant="body2" color="text.secondary">-5% from last week</Typography>
            </CardContent>
          </Card>
        </Grid>

         <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ bgcolor: 'blue.100', borderLeft: '6px solid #1e88e5', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Model Accuracy
              </Typography>
              <Typography variant="h4" color="primary.main">98.5%</Typography>
              <Typography variant="body2" color="text.secondary">+1.2% since retrain</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={2}>
         <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🗂️ Recent Scans
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2">invoice.pdf — <strong>Malicious</strong> | Confidence: 95%</Typography>
              <Typography variant="body2">report.docx — <strong>Safe</strong> | Confidence: 99%</Typography>
              <Typography variant="body2">qrcode.png — <strong>Malicious</strong> | Confidence: 82%</Typography>
            </CardContent>
          </Card>
        </Grid>

         <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🛠️ System Status
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2">All scanning services are operational.</Typography>
              <Typography variant="body2" mt={1}>Latest scan completed: <strong>5 mins ago</strong></Typography>
              <Typography variant="body2">Average response time: <strong>1.2s</strong></Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </UserLayout>
  );
};

export default UserDashboard;

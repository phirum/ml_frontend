import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, CircularProgress, Snackbar, Alert
} from '@mui/material';
import AdminLayout from '../layouts/AdminLayout';
import api from '../utils/axiosConfig';

const URLScanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    result: string;
    threat_type: string | null;
    confidence: number;
    message: string;
  }>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleScan = async () => {
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/scan/url', { url });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Scan failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ mt: 4, px: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>🌐 URL Scanner</Typography>

        <TextField
          label="Enter URL"
          variant="outlined"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleScan}
          disabled={loading || !url}
        >
          {loading ? <CircularProgress size={20} /> : 'Scan URL'}
        </Button>

        {result && (
          <Paper sx={{ mt: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom>🔍 Scan Result</Typography>
            <Typography>Label: <strong>{result.result}</strong></Typography>
            <Typography>Threat Type: {result.threat_type || 'N/A'}</Typography>
            <Typography>Confidence: {(result.confidence * 100).toFixed(2)}%</Typography>
            <Typography color="text.secondary">{result.message}</Typography>
          </Paper>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default URLScanner;

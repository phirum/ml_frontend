import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, CircularProgress, Snackbar, Alert
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AdminLayout from '../layouts/AdminLayout';
import api from '../utils/axiosConfig';

const QRInvoiceScanner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
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
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/scan/invoice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
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
        <Typography variant="h4" fontWeight="bold" gutterBottom>🧾 Invoice / QR Scanner</Typography>

        <Button variant="contained" component="label" startIcon={<UploadFileIcon />} sx={{ mb: 2 }}>
          Upload File
          <input type="file" hidden onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }} />
        </Button>

        {file && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected: <strong>{file.name}</strong>
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleScan}
          disabled={loading || !file}
        >
          {loading ? <CircularProgress size={20} /> : 'Scan File'}
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

export default QRInvoiceScanner;

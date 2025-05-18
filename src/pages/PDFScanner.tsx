import React, { useState } from 'react';
import {
  Box, Button, Typography, Paper, CircularProgress, Snackbar, Alert
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import api from '../utils/axiosConfig';
import UserLayout from '../layouts/UserLayout';

const PDFScanner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { result: string; confidence: number }>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!file) {
      setSnackbar({ open: true, message: 'Please select a PDF file.', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post('/scan/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      setSnackbar({ open: true, message: 'Scan completed successfully!', severity: 'success' });
    } catch (error) {
      console.error('Scan error:', error);
      setSnackbar({ open: true, message: 'Scan failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <Box sx={{ mt: 4, px: 3 }}>
        <Typography variant="h4" gutterBottom>
          📄 PDF Malware Scanner
        </Typography>

        <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
            Choose File
            <input hidden type="file" accept=".pdf" onChange={handleFileChange} />
          </Button>
          <Typography>{file?.name || 'No file chosen'}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleScan}
            disabled={!file || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Scan'}
          </Button>
        </Paper>

        {result && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Scan Result</Typography>
            <Typography>Result: <strong>{result.result.toUpperCase()}</strong></Typography>
            <Typography>Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong></Typography>
          </Paper>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </UserLayout>
  );
};

export default PDFScanner;

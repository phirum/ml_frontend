import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Paper, CircularProgress
} from '@mui/material';
import axios from 'axios';
import UserLayout from '../layouts/UserLayout';

interface ScanResponse {
  result: string;
  confidence: number;
}

const QRInvoiceScanner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!file) return;

    setIsLoading(true);
    setScanResult('');
    setConfidence(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<ScanResponse>('/api/scan/invoice-qr', formData);
      setScanResult(response.data.result);
      setConfidence(response.data.confidence);
    } catch (err: any) {
      setScanResult('Scan failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserLayout>
        <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Invoice/QR Scanner</Typography>
        <Paper sx={{ p: 3 }}>
          <TextField
            type="file"
            inputProps={{ accept: 'image/*' }}
            onChange={handleFileChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleScan} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Scan'}
          </Button>

          {scanResult && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Result: {scanResult}</Typography>
              {confidence !== null && <Typography variant="subtitle2">Confidence: {confidence}%</Typography>}
            </Box>
          )}
        </Paper>
      </Box>
    </UserLayout>
  );
};

export default QRInvoiceScanner;

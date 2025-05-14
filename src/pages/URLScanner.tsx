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

const URLScanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!url) return;

    setIsLoading(true);
    setScanResult('');
    setConfidence(null);

    try {
      const response = await axios.post<ScanResponse>('/api/scan/url', { url });
      setScanResult(response.data.result);
      setConfidence(response.data.confidence);
    } catch (error: any) {
      setScanResult('Error during URL scan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserLayout>
        <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>URL Scanner</Typography>
        <Paper sx={{ p: 3 }}>
          <TextField
            label="Enter URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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

export default URLScanner;

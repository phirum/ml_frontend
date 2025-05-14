import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Paper, CircularProgress
} from '@mui/material';
import axios from 'axios';
import UserLayout from '../layouts/UserLayout';

interface ScanResponse {
  result: string;
  confidence: number;
  threatType: string;
}

const NetworkLogs: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [threatType, setThreatType] = useState('');
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
    setThreatType('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<ScanResponse>('/api/scan/logs', formData);
      const data = response.data;
      setScanResult(data.result);
      setConfidence(data.confidence);
      setThreatType(data.threatType);
    } catch (err) {
      setScanResult('Log scan failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserLayout>
        <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Network Logs Scanner</Typography>
        <Paper sx={{ p: 3 }}>
          <TextField
            type="file"
            inputProps={{ accept: '.log,.txt' }}
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
              {threatType && <Typography variant="subtitle2">Threat Type: {threatType}</Typography>}
            </Box>
          )}
        </Paper>
      </Box>
    </UserLayout>
  );
};

export default NetworkLogs;

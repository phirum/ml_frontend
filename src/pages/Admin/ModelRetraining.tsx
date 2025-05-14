import React, { useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Typography, Paper, List, ListItem, ListItemText, Divider
} from '@mui/material';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';

interface RetrainLog {
  id: string;
  timestamp: string;
  message: string;
}

interface RetrainResponse {
  accuracy: number;
}

interface LogsResponse {
  logs: RetrainLog[];
}

const ModelRetraining: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<RetrainLog[]>([]);
  const [resultMessage, setResultMessage] = useState('');

  const handleRetrain = async () => {
    setIsLoading(true);
    setResultMessage('');
    try {
      const response = await axios.post<RetrainResponse>('/api/admin/retrain');
      setResultMessage(`✅ Retraining complete. Accuracy: ${response.data.accuracy}`);
      fetchLogs(); // Refresh log
    } catch (err: any) {
      setResultMessage(`❌ Failed to retrain: ${err?.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get<LogsResponse>('/api/admin/retrain-logs');
      setLogs(response.data.logs || []);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" gutterBottom>Model Retraining</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRetrain}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Start Retraining'}
        </Button>

        {resultMessage && (
          <Typography sx={{ mt: 2 }} color={resultMessage.startsWith('✅') ? 'success.main' : 'error.main'}>
            {resultMessage}
          </Typography>
        )}

        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6">Retraining Logs</Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            {logs.map(log => (
              <ListItem key={log.id}>
                <ListItemText primary={log.message} secondary={log.timestamp} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default ModelRetraining;

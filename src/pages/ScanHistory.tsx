// src/pages/ScanHistory.tsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress
} from '@mui/material';
import axios from 'axios';  
import UserLayout from '../layouts/UserLayout';

interface ScanRecord {
  id: string;
  filename: string;
  result: string;
  confidence: number;
  date: string;
}

const ScanHistory: React.FC = () => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<ScanRecord[]>('/api/history');
        setHistory(res.data);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <UserLayout>
       <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Scan History</Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Paper sx={{ mt: 2 }}>
            <List>
              {history.map((record) => (
                <ListItem key={record.id} divider>
                  <ListItemText
                    primary={`${record.filename} - ${record.result} (${record.confidence}%)`}
                    secondary={`Scanned on ${new Date(record.date).toLocaleString()}`}
                  />
                </ListItem>
              ))}
              {history.length === 0 && (
                <ListItem>
                  <ListItemText primary="No scan history found." />
                </ListItem>
              )}
            </List>
          </Paper>
        )}
      </Box>
    </UserLayout>
  );
};

export default ScanHistory;

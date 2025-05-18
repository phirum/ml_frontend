import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Snackbar, Alert,
  CircularProgress, Grid, Divider, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TablePagination, TextField
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../utils/axiosConfig';

interface RetrainLog {
  timestamp: string;
  admin_id: string;
  admin_email: string;
  dataset_filename: string;
  accuracy: number;
  f1_malicious: number;
  f1_benign: number;
  model_version: string;
}

const ModelRetraining: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<null | {
    accuracy: number;
    malicious_f1: number;
    benign_f1: number;
  }>(null);
  const [logs, setLogs] = useState<RetrainLog[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterAdmin, setFilterAdmin] = useState('');
  const [filterAccuracy, setFilterAccuracy] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleRetrain = async () => {
    if (!file) {
      setSnackbar({ open: true, message: 'Please select a CSV file.', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post('/model/retrain', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMetrics(response.data.metrics);
      setSnackbar({ open: true, message: 'Model retrained successfully!', severity: 'success' });
      const logResponse = await api.get('/model/retrain/logs');
      setLogs(logResponse.data);
    } catch (error) {
      console.error('Retraining error:', error);
      setSnackbar({ open: true, message: 'Retraining failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/model/retrain/logs');
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLogs([]);
      }
    };
    fetchLogs();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredLogs = logs.filter(log => {
    const matchesAdmin = filterAdmin === '' || log.admin_email.toLowerCase().includes(filterAdmin.toLowerCase());
    const matchesAccuracy = filterAccuracy === '' || log.accuracy >= parseFloat(filterAccuracy);
    return matchesAdmin && matchesAccuracy;
  });

  return (
    <AdminLayout>
      <Box sx={{ mt: 4, px: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🔁 Model Retraining
        </Typography>

        <Grid container spacing={2} alignItems="center" mb={3}>
          <Grid>
            <Button variant="contained" startIcon={<UploadFileIcon />} component="label">
              Select CSV
              <input type="file" hidden accept=".csv" onChange={handleFileChange} />
            </Button>
          </Grid>
          {file && (
            <Grid>
              <Typography>{file.name}</Typography>
            </Grid>
          )}
          <Grid>
            <Button
              variant="contained"
              color="success"
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
              onClick={handleRetrain}
              disabled={loading || !file}
            >
              {loading ? 'Retraining...' : 'Start Retraining'}
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {metrics && (
             <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>📊 Retraining Metrics</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography>Accuracy: <strong>{metrics.accuracy}</strong></Typography>
                <Typography>Malicious F1: <strong>{metrics.malicious_f1}</strong></Typography>
                <Typography>Benign F1: <strong>{metrics.benign_f1}</strong></Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>🗒️ Retraining Logs</Typography>

          <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Filter by Admin Email"
                variant="outlined"
                fullWidth
                value={filterAdmin}
                onChange={(e) => setFilterAdmin(e.target.value)}
              />
            </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Min Accuracy"
                variant="outlined"
                type="number"
                fullWidth
                value={filterAccuracy}
                onChange={(e) => setFilterAccuracy(e.target.value)}
              />
            </Grid>
          </Grid>

          {filteredLogs.length > 0 ? (
            <Paper>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Admin</strong></TableCell>
                      <TableCell><strong>Dataset</strong></TableCell>
                      <TableCell><strong>Accuracy</strong></TableCell>
                      <TableCell><strong>F1 - Malicious</strong></TableCell>
                      <TableCell><strong>F1 - Benign</strong></TableCell>
                      <TableCell><strong>Version</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{log.admin_email}</TableCell>
                        <TableCell>{log.dataset_filename}</TableCell>
                        <TableCell>{log.accuracy.toFixed(3)}</TableCell>
                        <TableCell>{log.f1_malicious.toFixed(3)}</TableCell>
                        <TableCell>{log.f1_benign.toFixed(3)}</TableCell>
                        <TableCell>{log.model_version}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredLogs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No logs available.
            </Typography>
          )}
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default ModelRetraining;
